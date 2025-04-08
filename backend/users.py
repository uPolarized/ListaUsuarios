import bcrypt
from flask import Blueprint, request, jsonify
from db_config import get_db_connection

users_bp = Blueprint('users', __name__)

@users_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    nome = data['nome']
    email = data['email']
    senha = data['senha']

    hashed = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt())

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO usuarios (nome, email, senha) VALUES (%s, %s, %s)", (nome, email, hashed))
        conn.commit()
        return jsonify({"msg": "Usuário registrado com sucesso"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()

@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    senha = data['senha']

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user and bcrypt.checkpw(senha.encode('utf-8'), user['senha'].encode('utf-8')):
        return jsonify({"msg": "Login bem-sucedido", "nome": user['nome']}), 200
    else:
        return jsonify({"error": "Credenciais inválidas"}), 401
