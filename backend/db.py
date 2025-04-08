import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="usuario",
        password="senha123",
        database="sistema_db"
    )
