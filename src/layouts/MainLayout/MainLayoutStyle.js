export const mainLayoutStyles = {
  wrapper: "flex min-h-screen bg-[#112950] font-serif font-medium",
  sidebarContainer: "fixed top-0 left-0 bottom-0 w-[260px] z-10",
  wireContainer:
    "fixed top-20 bottom-0 left-[260px] w-16 -translate-x-1/2 z-30 pointer-events-none flex flex-col gap-9 overflow-hidden",
  wireItem: "relative w-full h-6 shrink-0",
  wireBody:
    "absolute left-1/2 -translate-x-1/2 top-1 w-10 h-3.5 bg-[#93c5fd] rounded-full border-[2px] border-[#112950] z-20 shadow-sm",
  wireHole:
    "absolute left-[calc(50%+6px)] top-0.5 w-5 h-5 bg-[#112950] rounded-full shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)] z-10",
  contentWrapper: "flex-1 flex flex-col relative ml-[260px]",
  headerContainer:
    "h-16 flex items-center px-10 sticky top-0 z-50 bg-[#112950]",
  notebookPaper:
    "flex-1 bg-[#f8fafc] mr-4 mb-6 rounded-tl-sm rounded-bl-[2.5rem] rounded-tr-xl rounded-br-xl relative shadow-2xl flex flex-col z-20",
  mainArea: "p-10 pl-16 flex-1 flex flex-col",
  outletWrapper: "flex-1",
};
