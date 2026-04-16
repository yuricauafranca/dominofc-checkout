import { redirect } from "next/navigation";

// Default demo: redirect to Flamengo checkout
export default function Home() {
  redirect("/checkout?product=2967939592766");
}
