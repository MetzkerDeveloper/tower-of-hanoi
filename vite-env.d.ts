/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ADS_CLIENT_ID: string;
    readonly VITE_ADS_SLOT_ID: string;
    // Adicione mais variáveis se necessário
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  