# Como Contribuir para o Projeto Conversor

## Implementação Atual

O conversor foi desenvolvido com:
- HTML/CSS para a interface
- JavaScript para a lógica de conversão
- API de câmbio para taxas atualizadas
- Sistema de fallback para quando a API falha

## Como Configurar e Publicar no GitHub

1. Crie um novo repositório no GitHub:
   - Acesse github.com e clique em "New"
   - Escolha um nome para o repositório (ex: conversor)
   - Selecione "Public" ou "Private"
   - Clique em "Create repository"

2. Configure o repositório local:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/conversor.git
git push -u origin main
```

3. Instale as dependências:
```bash
npm install
```

4. Faça suas alterações em uma nova branch:
```bash
git checkout -b minha-feature
```

5. Envie as alterações:
```bash
git add .
git commit -m "Descrição das alterações"
git push origin minha-feature
```

6. Crie um Pull Request:
   - Acesse o repositório no GitHub
   - Clique em "Compare & pull request"
   - Descreva suas alterações
   - Clique em "Create pull request"


## Áreas para Contribuição

### Novas Funcionalidades
- Adicionar mais tipos de conversão
- Implementar gráficos de histórico
- Criar versão mobile

### Melhorias de Código
- Refatorar funções de conversão
- Adicionar testes unitários
- Melhorar tratamento de erros

### Documentação
- Escrever guia de uso
- Criar tutorial de instalação
- Documentar API

### Design
- Melhorar interface gráfica
- Adicionar temas
- Criar animações

## Tarefas Pendentes
- [ ] Adicionar mais testes unitários
- [ ] Implementar cache para as taxas de câmbio
- [ ] Criar sistema de plugins para novas conversões
- [ ] Desenvolver versão PWA
- [ ] Adicionar suporte a mais idiomas

## Padrões de Código
- Siga o ESLint configurado
- Mantenha commits atômicos
- Escreva testes para novas funcionalidades
- Documente suas alterações

## Dúvidas?
Abra uma issue no GitHub ou entre em contato com os mantenedores.
