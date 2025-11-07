package com.casaDoAmor.CasaDoAmor.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.casaDoAmor.CasaDoAmor.model.Usuario;
import com.casaDoAmor.CasaDoAmor.repository.UsuarioRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    @Transactional
    public Usuario salvar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
    @Transactional
    public void deletar(Usuario usuario) {
        usuarioRepository.delete(usuario);
    }
    @Transactional
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }
}
