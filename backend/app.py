from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import mysql.connector

app = Flask(__name__)
CORS(app)

# Conexão com banco
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="usuario",
        password="senha123",
        database="sistema_db"
    )

# Login
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")

    if not email or not senha:
        return jsonify({"success": False, "message": "Email e senha são obrigatórios."}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
    usuario = cursor.fetchone()
    cursor.close()
    conn.close()

    if usuario and bcrypt.checkpw(senha.encode(), usuario["senha"].encode()):
        return jsonify({"success": True, "message": "Login bem-sucedido!", "usuario": usuario})
    else:
        return jsonify({"success": False, "message": "Email ou senha inválidos."}), 401

# Listar todos os usuários
@app.route("/usuarios", methods=["GET"])
def listar_usuarios():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, nome, email FROM usuarios")
    usuarios = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(usuarios)

# Cadastrar novo usuário com senha hash
@app.route("/usuarios", methods=["POST"])
def cadastrar_usuario():
    data = request.get_json()
    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("senha")

    if not nome or not email or not senha:
        return jsonify({"detail": "Nome, email e senha são obrigatórios"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Verifica se já existe usuário com o email
    cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"detail": "Email já cadastrado"}), 400

    hash_senha = bcrypt.hashpw(senha.encode(), bcrypt.gensalt()).decode()

    cursor.execute(
        "INSERT INTO usuarios (nome, email, senha) VALUES (%s, %s, %s)",
        (nome, email, hash_senha)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Usuário cadastrado com sucesso!"}), 201

# Remover usuário por ID
@app.route("/usuarios/<int:id>", methods=["DELETE"])
def deletar_usuario(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM usuarios WHERE id = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Usuário removido com sucesso!"}), 200

# Rota de teste
@app.route('/', methods=['GET'])
def home():
    return 'API está rodando!', 200

if __name__ == "__main__":
    app.run(debug=True)
