export default function Footer() {
  return (
    <footer
      style={{ backgroundColor: "var(--primary-dark)" }}
      className="text-sky-200 mt-auto"
    >
      <div className="max-w-5xl mx-auto px-4 py-6 text-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="font-semibold text-white">
              Dégrèvement Eau – Loi Warsmann
            </p>
            <p className="text-sky-300 text-xs mt-0.5">
              Outil d&apos;aide à la démarche – Article L2224-12-4-1 du CGCT
            </p>
          </div>
          <div className="text-center sm:text-right text-xs text-sky-400">
            <p>
              Cet outil est fourni à titre informatif et ne constitue pas un
              conseil juridique.
            </p>
            <p className="mt-0.5">
              En cas de litige, consultez un professionnel du droit.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
