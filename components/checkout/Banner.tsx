export function Banner() {
  return (
    <div
      className="w-full"
      style={{ background: "#333", color: "#FFF" }}
    >
      <div className="mx-auto max-w-2xl lg:max-w-7xl w-full px-4 sm:px-0 py-2.5 md:py-3.5 text-[12px] md:text-[13px] flex justify-center text-center">
        <div className="w-full text-center">
          <p>Excelente escolha, o produto já é seu.</p>
          <p>Basta preencher algumas informações para que possamos enviar o seu pedido</p>
        </div>
      </div>
    </div>
  );
}
