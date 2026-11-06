@media print {
  body * { visibility: hidden; }
  #printable-nota-modal, #printable-nota-modal * { visibility: visible; }
  #printable-nota-modal { 
    position: absolute; 
    left: 0; 
    top: 0; 
    width: 100mm !important; 
    border: none !important; 
    box-shadow: none !important;
    padding: 4mm !important;
  }
  .no-print { display: none !important; }
}

/* Custom Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.3); border-radius: 4px; }

/* Sidebar Toggle Class */
.sidebar-hidden {
  display: none !important;
}
