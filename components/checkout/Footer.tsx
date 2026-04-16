export function Footer() {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center gap-1 text-center lg:text-xs text-sm mt-6 pb-8">
      <p className="w-full font-medium text-center mb-1" style={{ color: "#9ca3af" }}>
        Dominó FC | Todos os direitos reservados
      </p>
      <p className="w-full text-center" style={{ color: "#9ca3af" }}>
        Rua Elson Costa, 173 C - Bairro das industrias Belo Horizonte - Minas Gerais
      </p>
      <p className="w-full text-center" style={{ color: "#9ca3af" }}>
        © 2026 Dominó FC - CNPJ: 47.130.874/0001-05
      </p>
      <p className="w-full text-center" style={{ color: "#9ca3af" }}>
        <span>Telefone: </span>+55 (11) 3368-5599 / <span>E-mail: </span>contato@dominofc.com
      </p>

      <div className="flex flex-col items-center gap-2 mt-2">
        <p className="text-sm" style={{ color: "#9ca3af" }}>Formas de pagamento:</p>
        {/* Payment brand SVGs — inline from original */}
        <span className="inline-flex items-center flex-wrap gap-x-2 gap-y-2">
          {/* Aura */}
          <svg width="37.5" height="25" viewBox="44 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#aura-clip)">
              <path fillRule="evenodd" clipRule="evenodd" d="M79.5383 20.9994C79.5383 22.6494 78.6499 23.5379 76.9999 23.5379H46.9999C45.3499 23.5379 44.4614 22.6494 44.4614 20.9994L44.4614 2.9994C44.4614 1.3494 45.3499 0.460938 46.9999 0.460938H76.9999C78.6499 0.460938 79.5383 1.3494 79.5383 2.9994V20.9994Z" fill="#152884"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M44.4614 14.0814V21.0018C44.4614 22.6518 45.3499 23.5379 46.9999 23.5379H76.7691C78.4191 23.5379 79.5383 22.6518 79.5383 21.0018V14.9022C72.9791 12.7158 62.3498 9.53277 44.4614 14.0814Z" fill="#FFED00"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M44.4614 11.7785L44.4614 15.2819C62.3498 10.7339 72.9791 13.9169 79.5383 16.1021V12.4433C74.967 10.7477 62.156 6.95211 44.4614 11.7785Z" fill="#EB212E"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M55.4648 9.6953C56.3643 7.20953 58.4228 5.06273 62 5.08613C65.5766 5.11013 67.9622 7.15313 68.606 9.8261C63.9968 9.3473 60.9243 9.2633 55.4648 9.6953Z" fill="#FFED00"/>
            </g>
            <defs><clipPath id="aura-clip"><rect width="36" height="24" fill="white" transform="translate(44)"/></clipPath></defs>
          </svg>
          {/* Mastercard */}
          <svg width="37.5" height="25" viewBox="0 0 38 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="37" height="24" rx="3.5" fill="white" stroke="#D9D9D9"/>
            <circle cx="15" cy="12.5" r="7" fill="#EB001B"/>
            <circle cx="23" cy="12.5" r="7" fill="#F79E1B"/>
            <path d="M19 7.1A7 7 0 0 1 22.6 12.5 7 7 0 0 1 19 17.9 7 7 0 0 1 15.4 12.5 7 7 0 0 1 19 7.1Z" fill="#FF5F00"/>
          </svg>
          {/* Visa */}
          <svg width="37.5" height="25" viewBox="0 0 38 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="37" height="24" rx="3.5" fill="white" stroke="#D9D9D9"/>
            <path d="M16.5 16.5H14.2L15.7 8.5H18L16.5 16.5ZM12.5 8.5L10.3 13.7L10 12.4L9.1 9.3C9 8.9 8.7 8.5 8.2 8.5H5L5 8.7C5.8 8.9 6.8 9.2 7.5 9.6L9.5 16.5H11.9L15.6 8.5H12.5ZM27 16.5H29.1L27.3 8.5H25.4C24.9 8.5 24.6 8.8 24.4 9.2L20.9 16.5H23.3L23.8 15.1H26.7L27 16.5ZM24.5 13.4L25.7 10.2L26.3 13.4H24.5ZM21.8 10.5L22.1 8.8C21.5 8.6 20.7 8.4 19.8 8.4C17.4 8.4 15.7 9.6 15.7 11.3C15.7 12.6 16.9 13.2 17.8 13.6C18.7 14 19 14.3 19 14.6C19 15.1 18.4 15.3 17.8 15.3C16.9 15.3 16.4 15.1 15.7 14.8L15.4 14.7L15.1 16.5C15.8 16.8 16.9 17 18 17C20.5 17 22.1 15.8 22.1 14C22.1 12.9 21.4 12.1 20 11.5C19.2 11.1 18.7 10.9 18.7 10.5C18.7 10.1 19.2 9.8 20 9.8C20.7 9.8 21.3 9.9 21.8 10.1L22 10.2L21.8 10.5Z" fill="#1A1F71"/>
          </svg>
          {/* Elo */}
          <svg width="37.5" height="25" viewBox="0 0 38 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="37" height="24" rx="3.5" fill="white" stroke="#D9D9D9"/>
            <text x="8" y="17" fontFamily="Inter,sans-serif" fontWeight="700" fontSize="11" fill="#1C1C1C">elo</text>
          </svg>
          {/* Amex */}
          <svg width="37.5" height="25" viewBox="0 0 38 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="37" height="24" rx="3.5" fill="#2557D6" stroke="#2557D6"/>
            <text x="5" y="17" fontFamily="Inter,sans-serif" fontWeight="700" fontSize="8" fill="white">AMERICAN</text>
            <text x="5" y="22" fontFamily="Inter,sans-serif" fontWeight="700" fontSize="8" fill="white">EXPRESS</text>
          </svg>
          {/* Pix */}
          <svg width="37.5" height="25" viewBox="0 0 38 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="37" height="24" rx="3.5" fill="white" stroke="#D9D9D9"/>
            <path d="M19 6C21.5 6 23.7 7.1 25.2 8.8L23.1 10.9C22.2 9.7 20.7 9 19 9C17.3 9 15.8 9.7 14.9 10.9L12.8 8.8C14.3 7.1 16.5 6 19 6ZM19 19C16.5 19 14.3 17.9 12.8 16.2L14.9 14.1C15.8 15.3 17.3 16 19 16C20.7 16 22.2 15.3 23.1 14.1L25.2 16.2C23.7 17.9 21.5 19 19 19ZM11 12.5C11 11.4 11.3 10.4 11.8 9.5L14 11.7C13.9 12 13.9 12.3 14 12.5H11ZM27 12.5H24C24.1 12.3 24.1 12 24 11.7L26.2 9.5C26.7 10.4 27 11.4 27 12.5Z" fill="#32BCAD"/>
          </svg>
          {/* Diners */}
          <svg width="37.5" height="25" viewBox="0 0 38 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="37" height="24" rx="3.5" fill="white" stroke="#D9D9D9"/>
            <text x="6" y="17" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="8" fill="#004A97">Diners</text>
            <text x="6" y="23" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="7" fill="#004A97">Club</text>
          </svg>
          {/* Discover */}
          <svg width="37.5" height="25" viewBox="0 0 38 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="37" height="24" rx="3.5" fill="white" stroke="#D9D9D9"/>
            <circle cx="23" cy="12.5" r="6" fill="#F76F20"/>
            <text x="5" y="15" fontFamily="Inter,sans-serif" fontWeight="600" fontSize="7" fill="#231F20">DISC</text>
          </svg>
        </span>

        {/* Lock + PAGAMENTO 100% SEGURO */}
        <div className="flex flex-col items-center gap-1 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span className="text-xs font-semibold tracking-wide" style={{ color: "#9ca3af" }}>
            PAGAMENTO<br />100% SEGURO
          </span>
        </div>
      </div>
    </div>
  );
}
