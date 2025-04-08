from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.hash import bcrypt

from database import SessionLocal, engine
from models import Base, Usuario
import crud

Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 📦 Modelos
class UsuarioCreate(BaseModel):
    nome: str
    email: str
    senha: str

class UsuarioUpdate(BaseModel):
    nome: str
    email: str

class SenhaUpdate(BaseModel):
    nova_senha: str

# 📍 Rotas

@app.get("/usuarios")
def listar(db: Session = Depends(get_db)):
    return crud.listar_usuarios(db)

@app.post("/usuarios")
def criar(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    existente = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if existente:
        raise HTTPException(status_code=400, detail="Email já cadastrado.")
    
    return crud.criar_usuario(db, usuario.nome, usuario.email, usuario.senha)

@app.put("/usuarios/{usuario_id}")
def atualizar(usuario_id: int, usuario: UsuarioUpdate, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    db_usuario.nome = usuario.nome
    db_usuario.email = usuario.email
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

@app.put("/usuarios/{usuario_id}/senha")
def atualizar_senha(usuario_id: int, senha: SenhaUpdate, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    db_usuario.senha = bcrypt.hash(senha.nova_senha)
    db.commit()
    return {"mensagem": "Senha atualizada com sucesso"}

@app.delete("/usuarios/{usuario_id}")
def deletar(usuario_id: int, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    db.delete(db_usuario)
    db.commit()
    return {"mensagem": "Usuário removido com sucesso"}

@app.get("/")
def read_root():
    return {"mensagem": "API está funcionando!"}
