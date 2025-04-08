from sqlalchemy.orm import Session
from models import Usuario
from passlib.hash import bcrypt

def listar_usuarios(db: Session):
    return db.query(Usuario).all()

def criar_usuario(db: Session, nome: str, email: str, senha: str = None):
    senha_hash = bcrypt.hash(senha) if senha else None
    novo = Usuario(nome=nome, email=email, senha=senha_hash)
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo
