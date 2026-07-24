import { Link } from '@/i18n/navigation';

export default function Footer() {
  return (
    <footer className="bg-ink text-canvas/70 border-t border-canvas/10 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-2">
          <h4 className="font-bold text-canvas tracking-widest">
            全日本弓道審查情報檢索
          </h4>
          <p className="opacity-75 leading-relaxed text-sm">
            解決日本傳統連盟 HTML 舊網站檢索不易的痛點。本站致力於將公開數據結構化，提供全球弓道學習者最優雅、直覺的工具體驗。
          </p>
        </div>

        <div className="space-y-2 md:pl-16">
          <h4 className="font-bold text-canvas uppercase tracking-widest">網站導覽</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-gold transition-colors">審查情報首頁</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold transition-colors">關於本站 & 免責聲明</Link>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-canvas uppercase tracking-widest">資料透明度</h4>
          <div className="font-mono text-sm">
            <div className="text-gold">最後同步：2026/06/30 (JST)</div>
          </div>
        </div>

      </div>
      <div className="max-w-6xl mx-auto px-6 mt-10 pt-6 border-t border-canvas/5 text-center text-xs opacity-40 font-mono tracking-wide">
        &copy; 2026 Wen Chih-Kai (Kyudo Tori). All rights reserved.
      </div>
    </footer>
  );
}