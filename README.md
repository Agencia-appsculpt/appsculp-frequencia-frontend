# AppSculp Frequência - Frontend

Sistema de controle de frequência desenvolvido com React e Vite.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces de usuário
- **Vite** - Build tool rápida e moderna
- **Tailwind CSS** - Framework CSS utilitário
- **Firebase** - Backend como serviço (autenticação e banco de dados)
- **React Router** - Roteamento para aplicações React
- **Shadcn/ui** - Componentes de UI modernos

## 📋 Funcionalidades

- **Autenticação de usuários** com Firebase
- **Controle de frequência** via QR Code
- **Painel administrativo** para gestão de usuários e turmas
- **Relatórios** de frequência
- **Interface responsiva** para desktop e mobile

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/appsculp-frequencia-frontend.git
cd appsculp-frequencia-frontend
```

2. **Instale as dependências**
```bash
npm install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=seu_app_id
```

4. **Execute o projeto**
```bash
npm run dev
# ou
pnpm dev
```

O projeto estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de UI (Shadcn/ui)
│   ├── Layout.jsx      # Layout principal
│   └── ProtectedRoute.jsx # Rota protegida
├── config/             # Configurações
│   ├── api.jsx         # Configuração da API
│   └── firebase.jsx    # Configuração do Firebase
├── contexts/           # Contextos React
│   └── AuthContext.jsx # Contexto de autenticação
├── hooks/              # Hooks customizados
├── lib/                # Utilitários
├── pages/              # Páginas da aplicação
│   ├── admin/          # Páginas administrativas
│   ├── Dashboard.jsx   # Dashboard principal
│   ├── Login.jsx       # Página de login
│   └── QRCodePage.jsx  # Página de QR Code
└── main.jsx           # Ponto de entrada
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 👥 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no repositório. 