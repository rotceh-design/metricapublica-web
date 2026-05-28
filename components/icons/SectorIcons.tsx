import { SectorIconKey } from "@/types/sector";

type SectorIconProps = {
  iconKey: SectorIconKey;
  className?: string;
};

const baseClass = "h-9 w-9";

function GobiernoIcon({ className = baseClass }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="6" y="36" width="36" height="4" rx="1" fill="currentColor" opacity="0.35" />
      <rect x="4" y="40" width="40" height="3" rx="1" fill="currentColor" opacity="0.55" />
      <rect x="10" y="20" width="4" height="16" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="18" y="20" width="4" height="16" rx="1" fill="currentColor" opacity="0.75" />
      <rect x="26" y="20" width="4" height="16" rx="1" fill="currentColor" opacity="0.75" />
      <rect x="34" y="20" width="4" height="16" rx="1" fill="currentColor" opacity="0.7" />
      <path d="M6 20h36v2H6z" fill="currentColor" opacity="0.55" />
      <path d="M24 6L4 18h40L24 6z" fill="currentColor" />
      <circle cx="24" cy="13" r="2" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

function CampanasIcon({ className = baseClass }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="5" y="34" width="8" height="10" rx="1.5" fill="currentColor" opacity="0.45" />
      <rect x="15" y="27" width="8" height="17" rx="1.5" fill="currentColor" opacity="0.6" />
      <rect x="25" y="19" width="8" height="25" rx="1.5" fill="currentColor" opacity="0.78" />
      <rect x="35" y="11" width="8" height="33" rx="1.5" fill="currentColor" />
      <path
        d="M9 28L19 21L29 14L39 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="9" cy="28" r="2.5" fill="currentColor" opacity="0.55" />
      <circle cx="19" cy="21" r="2.5" fill="currentColor" opacity="0.68" />
      <circle cx="29" cy="14" r="2.5" fill="currentColor" opacity="0.82" />
      <circle cx="39" cy="7" r="2.5" fill="currentColor" />
    </svg>
  );
}

function PrivadoIcon({ className = baseClass }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="4" y="18" width="20" height="26" rx="2" fill="currentColor" opacity="0.45" />
      <rect x="8" y="22" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.9" />
      <rect x="16" y="22" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.9" />
      <rect x="8" y="30" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.9" />
      <rect x="16" y="30" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.9" />
      <rect x="10" y="38" width="8" height="6" rx="0.5" fill="currentColor" opacity="0.7" />
      <rect x="22" y="8" width="22" height="36" rx="2" fill="currentColor" opacity="0.78" />
      <rect x="26" y="12" width="4" height="4" rx="0.5" fill="#0a1628" opacity="0.45" />
      <rect x="34" y="12" width="4" height="4" rx="0.5" fill="#0a1628" opacity="0.45" />
      <rect x="26" y="20" width="4" height="4" rx="0.5" fill="#0a1628" opacity="0.45" />
      <rect x="34" y="20" width="4" height="4" rx="0.5" fill="#0a1628" opacity="0.45" />
      <rect x="26" y="28" width="4" height="4" rx="0.5" fill="#0a1628" opacity="0.45" />
      <rect x="34" y="28" width="4" height="4" rx="0.5" fill="#0a1628" opacity="0.45" />
      <rect x="29" y="36" width="6" height="8" rx="0.5" fill="#0a1628" opacity="0.45" />
      <path d="M28 4h6l2 4H26l2-4z" fill="currentColor" />
    </svg>
  );
}

function OrganizacionesIcon({ className = baseClass }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="15" cy="14" r="5" fill="currentColor" opacity="0.72" />
      <circle cx="33" cy="14" r="5" fill="currentColor" opacity="0.72" />
      <circle cx="24" cy="24" r="6" fill="currentColor" />
      <path
        d="M6 39c1.3-7 5.4-11 10.5-11 3.1 0 5.7 1.4 7.5 3.9"
        fill="currentColor"
        opacity="0.38"
      />
      <path
        d="M42 39c-1.3-7-5.4-11-10.5-11-3.1 0-5.7 1.4-7.5 3.9"
        fill="currentColor"
        opacity="0.38"
      />
      <path d="M12 42c1.5-8.2 6-12.5 12-12.5S34.5 33.8 36 42H12z" fill="currentColor" opacity="0.82" />
      <path
        d="M17 27c2 2 4.3 3 7 3s5-1 7-3"
        stroke="#0a1628"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

function AcademiaIcon({ className = baseClass }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M4 17L24 8l20 9-20 9L4 17z" fill="currentColor" />
      <path d="M12 22v9c0 4.4 5.4 8 12 8s12-3.6 12-8v-9" fill="currentColor" opacity="0.58" />
      <path d="M24 26v13" stroke="#0a1628" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      <path d="M40 18v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <circle cx="40" cy="33" r="3" fill="currentColor" opacity="0.7" />
      <path
        d="M16 25c2.2 2 4.8 3 8 3s5.8-1 8-3"
        stroke="#0a1628"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

function TerritorioIcon({ className = baseClass }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M8 10l10-4 12 5 10-3v30l-10 4-12-5-10 3V10z" fill="currentColor" opacity="0.35" />
      <path d="M18 6v31M30 11v31" stroke="currentColor" strokeWidth="2" opacity="0.75" />
      <circle cx="24" cy="23" r="6" fill="currentColor" />
      <path d="M24 16c-5 0-9 4-9 9 0 7 9 15 9 15s9-8 9-15c0-5-4-9-9-9z" fill="currentColor" opacity="0.85" />
      <circle cx="24" cy="25" r="3" fill="#0a1628" opacity="0.45" />
    </svg>
  );
}

function DatosIcon({ className = baseClass }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="7" y="26" width="7" height="16" rx="1.5" fill="currentColor" opacity="0.45" />
      <rect x="18" y="18" width="7" height="24" rx="1.5" fill="currentColor" opacity="0.65" />
      <rect x="29" y="10" width="7" height="32" rx="1.5" fill="currentColor" opacity="0.9" />
      <path
        d="M9 18c6 1 9-8 15-6 5 1.5 6 8 14 3"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="9" cy="18" r="3" fill="currentColor" />
      <circle cx="24" cy="12" r="3" fill="currentColor" />
      <circle cx="38" cy="15" r="3" fill="currentColor" />
    </svg>
  );
}

function ComunicacionIcon({ className = baseClass }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M8 12h32v20H21L12 40v-8H8V12z" fill="currentColor" opacity="0.75" />
      <circle cx="18" cy="22" r="2.5" fill="#0a1628" opacity="0.45" />
      <circle cx="24" cy="22" r="2.5" fill="#0a1628" opacity="0.45" />
      <circle cx="30" cy="22" r="2.5" fill="#0a1628" opacity="0.45" />
      <path
        d="M34 8c4 2 6 5.5 6 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M38 5c5 3 8 7.5 8 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

export const sectorIconOptions: {
  value: SectorIconKey;
  label: string;
}[] = [
  { value: "gobierno", label: "Gobierno" },
  { value: "campanas", label: "Campañas" },
  { value: "privado", label: "Sector privado" },
  { value: "organizaciones", label: "Organizaciones" },
  { value: "academia", label: "Academia" },
  { value: "territorio", label: "Territorio" },
  { value: "datos", label: "Datos" },
  { value: "comunicacion", label: "Comunicación" },
];

export default function SectorIcon({
  iconKey,
  className = baseClass,
}: SectorIconProps) {
  const icons = {
    gobierno: GobiernoIcon,
    campanas: CampanasIcon,
    privado: PrivadoIcon,
    organizaciones: OrganizacionesIcon,
    academia: AcademiaIcon,
    territorio: TerritorioIcon,
    datos: DatosIcon,
    comunicacion: ComunicacionIcon,
  };

  const Icon = icons[iconKey] || GobiernoIcon;

  return <Icon className={className} />;
}