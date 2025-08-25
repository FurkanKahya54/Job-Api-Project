from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import sqlite3
import threading
import requests
from bs4 import BeautifulSoup
import networkx as nx

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Tüm frontend isteklerini kabul et

# --------------------
# DB Bağlantısı & Tablo
# --------------------
def get_db_connection():
    conn = sqlite3.connect('jobs.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT,
            command_or_url TEXT,
            status TEXT,
            result TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

init_db()

# --------------------
# Helper: DB Job ekleme & güncelleme
# --------------------
def add_job_to_db(job_type, command_or_url):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO jobs (type, command_or_url, status) VALUES (?, ?, ?)",
                (job_type, command_or_url, "pending"))
    job_id = cur.lastrowid
    conn.commit()
    conn.close()
    return job_id

def update_job_in_db(job_id, status, result):
    conn = get_db_connection()
    conn.execute("UPDATE jobs SET status=?, result=? WHERE id=?", (status, result, job_id))
    conn.commit()
    conn.close()

# --------------------
# Job 1: OS komutu çalıştırma
# --------------------
@app.route('/job/os', methods=['POST'])
def run_os_command():
    data = request.get_json()
    command = data.get("command")
    if not command or not isinstance(command, str):
        return jsonify({"status": "error", "message": "Geçerli bir komut girin"}), 400

    job_id = add_job_to_db("os", command)

    def run_command():
        try:
            result = subprocess.check_output(command, shell=True, text=True)
            status = "success"
        except Exception as e:
            result = str(e)
            status = "error"
        update_job_in_db(job_id, status, result)

    threading.Thread(target=run_command).start()  # Async çalıştır
    return jsonify({"id": job_id, "status": "pending", "result": None})

# --------------------
# Job 2: Crawl (Katana alternatifi) + detay URL kaydı
# --------------------
def crawl_url(url):
    graph = nx.DiGraph()
    try:
        resp = requests.get(url, timeout=10)
        soup = BeautifulSoup(resp.text, "html.parser")
        graph.add_node(url)
        for link in soup.find_all('a', href=True):
            href = link['href']
            if href.startswith("http"):
                graph.add_node(href)
                graph.add_edge(url, href)
    except Exception as e:
        raise e
    return graph

@app.route('/job/crawl', methods=['POST'])
def crawl_site():
    data = request.get_json()
    url = data.get("url")
    if not url or not isinstance(url, str):
        return jsonify({"status": "error", "message": "Geçerli bir URL girin"}), 400

    job_id = add_job_to_db("crawl", url)

    def run_crawl():
        try:
            graph = crawl_url(url)
            found_urls = len(graph.nodes)
            
            conn = get_db_connection()
            for node_url in graph.nodes:
                if node_url != url:
                    conn.execute(
                        "INSERT INTO jobs (type, command_or_url, status, result) VALUES (?, ?, ?, ?)",
                        ("crawl_url", node_url, "success", "found")
                    )
            conn.commit()
            conn.close()

            result = f"{found_urls} urls found"
            status = "success"
        except Exception as e:
            result = str(e)
            status = "error"
        update_job_in_db(job_id, status, result)

    threading.Thread(target=run_crawl).start()
    return jsonify({"id": job_id, "status": "pending", "result": None})

# ----------------------------
# /jobs route: listeleme + pagination + filter
# ----------------------------
@app.route('/jobs', methods=['GET'])
def get_jobs():
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        job_type = request.args.get('type', None)
    except ValueError:
        return jsonify({"status": "error", "message": "page ve per_page sayısal olmalı"}), 400

    query = "SELECT * FROM jobs"
    params = []
    if job_type:
        query += " WHERE type=?"
        params.append(job_type)
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    params.extend([per_page, (page-1)*per_page])

    conn = get_db_connection()
    jobs = conn.execute(query, params).fetchall()
    conn.close()
    return jsonify([dict(job) for job in jobs])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
