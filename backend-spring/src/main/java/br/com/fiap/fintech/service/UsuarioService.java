package br.com.fiap.fintech.service;

import br.com.fiap.fintech.model.Usuario;
import br.com.fiap.fintech.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario cadastrar(Usuario usuario) {

        if (usuario.getAtivo() == null) {
            usuario.setAtivo("S");
        }

        usuario.setDataCadastro(LocalDateTime.now());

        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Integer id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> atualizar(Integer id, Usuario usuarioAtualizado) {

        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);

        if (usuarioExistente.isEmpty()) {
            return Optional.empty();
        }

        Usuario usuario = usuarioExistente.get();

        usuario.setNome(usuarioAtualizado.getNome());
        usuario.setEmail(usuarioAtualizado.getEmail());
        usuario.setSenhaHash(usuarioAtualizado.getSenhaHash());
        usuario.setAtivo(usuarioAtualizado.getAtivo());
        usuario.setDataAtualizacao(LocalDateTime.now());

        return Optional.of(usuarioRepository.save(usuario));
    }

    public boolean excluir(Integer id) {

        if (!usuarioRepository.existsById(id)) {
            return false;
        }

        usuarioRepository.deleteById(id);
        return true;
    }
}