package com.casaDoAmor.CasaDoAmor.service;
import java.util.List;
import org.springframework.stereotype.Service;
import com.casaDoAmor.CasaDoAmor.model.Usuario;
import com.casaDoAmor.CasaDoAmor.repository.UsuarioRepository;
import jakarta.transaction.Transactional;

@Service
public class UsuarioService {
    UsuarioRepository usuario_repository;

    public UsuarioService(UsuarioRepository usuario_repository) {
        this.usuario_repository = usuario_repository;
    }
    @Transactional
    public List<Usuario> listarTodos() {
        return usuario_repository.findAll();
    }
    @Transactional
    public Usuario salvar(Usuario usuario) {
        return usuario_repository.save(usuario);
    }
    @Transactional
    public void deletar(Usuario usuario) {
        usuario_repository.delete(usuario);
    }
}
