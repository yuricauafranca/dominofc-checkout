export interface Product {
  productId: string;
  storeId: string;
  name: string;
  fullName: string;
  price: number;
  image: string;       // team logo in /public/images/
  productImage?: string; // actual product photo (if available)
}

const GENERIC_PRODUCT = "/images/domino-product-CRFCHRgT.jpg";

export const PRODUCTS: Product[] = [
  { productId: "2967939592766", storeId: "29679", name: "Flamengo",     fullName: "Dominó Flamengo + Caixa Personalizável com Nome",     price: 129.90, image: "/images/flamengo-CT6C_JYl.png",    productImage: "/images/flamengo-Cv1t2AWm.jpg" },
  { productId: "2967954251688", storeId: "29679", name: "Corinthians",  fullName: "Dominó Corinthians + Caixa Personalizável com Nome",  price: 129.90, image: "/images/corinthians-DfQanM40.png", productImage: "/images/corinthians-Bn_4mUYX.jpg" },
  { productId: "2967967825583", storeId: "29679", name: "São Paulo",    fullName: "Dominó São Paulo + Caixa Personalizável com Nome",    price: 129.90, image: "/images/sao-paulo-DA71orLb.png",   productImage: "/images/sao-paulo-5sRG1dVe.jpg" },
  { productId: "2967964923824", storeId: "29679", name: "Palmeiras",    fullName: "Dominó Palmeiras + Caixa Personalizável com Nome",    price: 129.90, image: "/images/palmeiras-D6gormX-.png",   productImage: "/images/palmeiras-B9h2FyaW.jpg" },
  { productId: "2967962919579", storeId: "29679", name: "Vasco",        fullName: "Dominó Vasco + Caixa Personalizável com Nome",        price: 129.90, image: "/images/vasco-BDHPOdXP.png",       productImage: "/images/vasco-D8iZDCvb.jpg" },
  { productId: "2967931369548", storeId: "29679", name: "Grêmio",       fullName: "Dominó Grêmio + Caixa Personalizável com Nome",       price: 129.90, image: "/images/gremio-DoOHUBBU.png",      productImage: "/images/gremio-DELqM3DF.jpg" },
  { productId: "2967957496498", storeId: "29679", name: "Cruzeiro",     fullName: "Dominó Cruzeiro + Caixa Personalizável com Nome",     price: 129.90, image: "/images/cruzeiro-CppIg5TR.png",    productImage: "/images/cruzeiro-tkc21JWe.jpg" },
  { productId: "2967957847976", storeId: "29679", name: "Atlético-MG",  fullName: "Dominó Atlético-MG + Caixa Personalizável com Nome",  price: 129.90, image: "/images/atletico-mg-CQZa0nE7.png", productImage: "/images/atletico-mg-BJ0qjdss.jpg" },
  { productId: "2967925159414", storeId: "29679", name: "Santos",       fullName: "Dominó Santos + Caixa Personalizável com Nome",       price: 129.90, image: "/images/santos-B3asRyA7.png",      productImage: "/images/santos-Cm3gxMPi.jpg" },
  { productId: "2967981949439", storeId: "29679", name: "Internacional",fullName: "Dominó Internacional + Caixa Personalizável com Nome",price: 129.90, image: "/images/internacional-BuGooc5p.png",productImage: "/images/internacional-PxNMVhCX.jpg" },
  { productId: "2967993941371", storeId: "29679", name: "Botafogo",     fullName: "Dominó Botafogo + Caixa Personalizável com Nome",     price: 129.90, image: "/images/botafogo-DNmBMTSV.png",    productImage: "/images/botafogo-vzUf9vlN.jpg" },
  { productId: "2967968799832", storeId: "29679", name: "Bahia",        fullName: "Dominó Bahia + Caixa Personalizável com Nome",        price: 129.90, image: "/images/bahia-CVoflQXD.png",       productImage: "/images/bahia-CFFpyEp2.jpg" },
  { productId: "2967929926797", storeId: "29679", name: "Fluminense",   fullName: "Dominó Fluminense + Caixa Personalizável com Nome",   price: 129.90, image: "/images/fluminense-DBp4KIrw.png",  productImage: "/images/fluminense-DrwiQ3VL.jpg" },
  { productId: "2967928137713", storeId: "29679", name: "Coritiba",     fullName: "Dominó Coritiba + Caixa Personalizável com Nome",     price: 129.90, image: "/images/coritiba-CVn5BOij.png",    productImage: "/images/coritiba-BcmdJYum.jpg" },
  { productId: "2967966661867", storeId: "29679", name: "Remo",         fullName: "Dominó Remo + Caixa Personalizável com Nome",         price: 129.90, image: "/images/remo-CUmxhKds.png",        productImage: "/images/remo-CKZI9mYi.jpg" },
  { productId: "2996936527961", storeId: "29969", name: "Athletico-PR", fullName: "Dominó Athletico-PR + Caixa Personalizável com Nome", price: 129.90, image: "/images/atletico-pr-Bls-VYHv.png",  productImage: "/images/atletico-pr-CBW3qoZP.jpg" },
  { productId: "2967969174364", storeId: "29679", name: "Vitória",      fullName: "Dominó Vitória + Caixa Personalizável com Nome",      price: 129.90, image: "/images/vitoria-BZuPdfsk.png",     productImage: "/images/vitoria-DGHdNoMA.jpg" },
  { productId: "2967994852416", storeId: "29679", name: "Chapecoense",  fullName: "Dominó Chapecoense + Caixa Personalizável com Nome",  price: 129.90, image: "/images/chapecoense-j_T2zo74.png", productImage: "/images/chapecoense-DW4i818K.jpg" },
  { productId: "2967989718382", storeId: "29679", name: "Bragantino",   fullName: "Dominó Bragantino + Caixa Personalizável com Nome",   price: 129.90, image: "/images/bragantino-Dl6gkaKd.png",  productImage: "/images/bragantino-DyCVADgp.jpg" },
  { productId: "2967913593669", storeId: "29679", name: "Mirassol",     fullName: "Dominó Mirassol + Caixa Personalizável com Nome",     price: 129.90, image: "/images/mirassol-C1paWuPP.png",    productImage: "/images/mirassol-CCpTKPyd.jpg" },
  { productId: "2967959196163", storeId: "29679", name: "Sport Recife",  fullName: "Dominó Sport Recife + Caixa Personalizável com Nome",  price: 129.90, image: "/images/sport-recife-COqaWyjp.png", productImage: GENERIC_PRODUCT },
  { productId: "2967944179586", storeId: "29679", name: "Fortaleza",    fullName: "Dominó Fortaleza + Caixa Personalizável com Nome",    price: 129.90, image: "/images/fortaleza-CT7ScVje.png",   productImage: GENERIC_PRODUCT },
  { productId: "2967989124724", storeId: "29679", name: "Ceará",        fullName: "Dominó Ceará + Caixa Personalizável com Nome",        price: 129.90, image: "/images/ceara-DaFjOZ6l.png",      productImage: GENERIC_PRODUCT },
  { productId: "2967922884188", storeId: "29679", name: "Goiás",        fullName: "Dominó Goiás + Caixa Personalizável com Nome",        price: 129.90, image: "/images/goias-Furabq2N.png",      productImage: GENERIC_PRODUCT },
  { productId: "2967998655427", storeId: "29679", name: "Avaí",         fullName: "Dominó Avaí + Caixa Personalizável com Nome",         price: 129.90, image: "/images/avai-C6rZYlQS.png",       productImage: GENERIC_PRODUCT },
  { productId: "2967934891738", storeId: "29679", name: "América-MG",   fullName: "Dominó América-MG + Caixa Personalizável com Nome",   price: 129.90, image: "/images/america-mg-DDaZBT1k.png", productImage: GENERIC_PRODUCT },
  { productId: "2967946783558", storeId: "29679", name: "Juventude",    fullName: "Dominó Juventude + Caixa Personalizável com Nome",    price: 129.90, image: "/images/juventude-D-9K3k7P.png",  productImage: GENERIC_PRODUCT },
  { productId: "2967931271823", storeId: "29679", name: "Cuiabá",       fullName: "Dominó Cuiabá + Caixa Personalizável com Nome",       price: 129.90, image: "/images/cuiaba-DftD2yEq.png",     productImage: GENERIC_PRODUCT },
  { productId: "2967963856162", storeId: "29679", name: "CRB",          fullName: "Dominó CRB + Caixa Personalizável com Nome",          price: 129.90, image: "/images/crb-Bnl4VEho.png",        productImage: GENERIC_PRODUCT },
  { productId: "2967961935413", storeId: "29679", name: "Novorizontino",fullName: "Dominó Novorizontino + Caixa Personalizável com Nome", price: 129.90, image: "/images/novo-horizonte-kZElnPDA.png", productImage: GENERIC_PRODUCT },
  { productId: "2967912596882", storeId: "29679", name: "São Bernardo", fullName: "Dominó São Bernardo + Caixa Personalizável com Nome", price: 129.90, image: "/images/sao-bernardo-DcuXG7dY.png", productImage: GENERIC_PRODUCT },
  { productId: "2967913119421", storeId: "29679", name: "Botafogo-SP",  fullName: "Dominó Botafogo-SP + Caixa Personalizável com Nome",  price: 129.90, image: "/images/botafogo-sp-Gj7eQ0-0.png", productImage: GENERIC_PRODUCT },
  { productId: "2967913974736", storeId: "29679", name: "Operário",     fullName: "Dominó Operário + Caixa Personalizável com Nome",     price: 129.90, image: "/images/operario-BXbkJsOc.png",   productImage: GENERIC_PRODUCT },
  { productId: "2967915612853", storeId: "29679", name: "Londrina",     fullName: "Dominó Londrina + Caixa Personalizável com Nome",     price: 129.90, image: "/images/londrina-CPL2M9aT.png",   productImage: GENERIC_PRODUCT },
  { productId: "2967916162367", storeId: "29679", name: "Atlético-GO",  fullName: "Dominó Atlético-GO + Caixa Personalizável com Nome",  price: 129.90, image: "/images/atletico-go-vjWdmOOC.png", productImage: GENERIC_PRODUCT },
  { productId: "2967919486578", storeId: "29679", name: "Vila Nova",    fullName: "Dominó Vila Nova + Caixa Personalizável com Nome",    price: 129.90, image: "/images/vila-nova-D_DQbxTE.png",  productImage: GENERIC_PRODUCT },
  { productId: "2967934846264", storeId: "29679", name: "Criciúma",     fullName: "Dominó Criciúma + Caixa Personalizável com Nome",     price: 129.90, image: "/images/criciuma-RYTaqEq0.png",   productImage: GENERIC_PRODUCT },
  { productId: "2967963776653", storeId: "29679", name: "Guarani",      fullName: "Dominó Guarani + Caixa Personalizável com Nome",      price: 129.90, image: "/images/guarani-CXE2OuiN.png",    productImage: GENERIC_PRODUCT },
  { productId: "2967964953448", storeId: "29679", name: "Ponte Preta",  fullName: "Dominó Ponte Preta + Caixa Personalizável com Nome",  price: 129.90, image: "/images/ponte-preta-D4v4iRCP.png", productImage: GENERIC_PRODUCT },
  { productId: "2967975256886", storeId: "29679", name: "Náutico",      fullName: "Dominó Náutico + Caixa Personalizável com Nome",      price: 129.90, image: "/images/nautico-Bk6D7WAm.png",    productImage: GENERIC_PRODUCT },
  { productId: "2967979279863", storeId: "29679", name: "Athletic Club",fullName: "Dominó Athletic Club + Caixa Personalizável com Nome",price: 129.90, image: "/images/athletic-club-wFfXGopm.png", productImage: GENERIC_PRODUCT },
  { productId: "2967983178444", storeId: "29679", name: "Ypiranga",     fullName: "Dominó Ypiranga + Caixa Personalizável com Nome",     price: 129.90, image: "/images/ypiranga-DJ6T7fq6.png",   productImage: GENERIC_PRODUCT },
  { productId: "2967988476771", storeId: "29679", name: "Caxias",       fullName: "Dominó Caxias + Caixa Personalizável com Nome",       price: 129.90, image: "/images/caxias-ITLds5Rc.png",     productImage: GENERIC_PRODUCT },
  { productId: "2967989621633", storeId: "29679", name: "Santa Cruz",   fullName: "Dominó Santa Cruz + Caixa Personalizável com Nome",   price: 129.90, image: "/images/santa-cruz-DEZh-F3z.png", productImage: GENERIC_PRODUCT },
  { productId: "2967989881578", storeId: "29679", name: "Figueirense",  fullName: "Dominó Figueirense + Caixa Personalizável com Nome",  price: 129.90, image: "/images/figueirense-Ubb8rGPV.png", productImage: GENERIC_PRODUCT },
  { productId: "2967999424736", storeId: "29679", name: "Confiança",    fullName: "Dominó Confiança + Caixa Personalizável com Nome",    price: 129.90, image: "/images/confianca-B1DkPrFf.png",  productImage: GENERIC_PRODUCT },
  { productId: "2967953181979", storeId: "29679", name: "Santa Cruz",   fullName: "Dominó Santa Cruz + Caixa Personalizável com Nome",   price: 129.90, image: "/images/santa-cruz-DEZh-F3z.png", productImage: GENERIC_PRODUCT },
];

export function getProduct(productId: string): Product | null {
  return PRODUCTS.find((p) => p.productId === productId) ?? null;
}

export function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}
