import Link from "next/link";
export default function NotFound(){return <main className="container page"><div className="empty"><h1 className="page-title">We couldn't find that.</h1><p className="muted">The product or page may have moved.</p><Link href="/" className="button">Back to shop</Link></div></main>}
