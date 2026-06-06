export const styles = {
  layout: "flex min-h-screen bg-[#112950] pb-12 font-sans",
  sidebar: "w-[260px] bg-[#112950] text-white flex flex-col relative z-20 pt-8",
  ringsWrapper:
    "absolute -right-5 top-20 bottom-32 flex flex-col justify-between z-30",
  ring: "w-10 h-4 bg-[#a5c8ff] rounded-full border-[2.5px] border-[#112950] shadow-sm",
  mascotContainer: "flex justify-center mb-6",
  mascotBox:
    "bg-white p-2 rounded-[2rem] w-20 h-20 flex items-center justify-center shadow-lg",
  workspaceBtn:
    "mx-6 bg-[#a5c8ff] text-[#112950] font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 mb-10 text-sm",

  navMenu: "flex flex-col px-4",
  navItemActive:
    "flex items-center gap-3 px-4 py-3 text-sm font-bold bg-[#4a6b9c] rounded-xl text-white mb-2 cursor-pointer",
  navItem:
    "flex items-center gap-3 px-4 py-4 text-sm font-medium text-gray-200 border-b border-gray-500/50 cursor-pointer hover:bg-white/5",

  mainContent: "flex-1 bg-white rounded-bl-3xl p-10 flex flex-col gap-10",

  headerCard:
    "bg-[#112950] text-white rounded-[2rem] px-10 py-8 flex justify-between items-center relative shadow-md h-36",
  headerTitle: "text-3xl font-bold mb-2 font-serif",
  headerSubtitle: "text-xs text-gray-300 max-w-lg leading-relaxed",
  headerMascotContainer:
    "w-28 h-28 bg-[#112950] rounded-full border-[3px] border-[#a5c8ff] absolute right-8 flex items-center justify-center overflow-hidden",

  sectionTitle: "text-2xl font-bold text-[#112950] mb-5 font-serif",

  invitationRow:
    "flex items-center justify-between bg-[#b3d4ff] border-[2px] border-[#112950] rounded-full px-8 py-3 mb-3",
  invitationText: "text-[#112950] font-bold text-sm",
  actionBtn:
    "bg-[#112950] text-white text-xs font-bold px-6 py-2 rounded-full hover:scale-105 transition",

  roomsGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  roomCard:
    "bg-[#b3d4ff] border-[2px] border-[#112950] rounded-[2rem] p-6 relative h-36 flex flex-col justify-center shadow-sm",
  roomTitle: "text-lg font-bold text-[#112950] mb-2 font-serif",
  roomText: "text-[#112950] font-bold text-xs mb-1",
  participantsBadge:
    "absolute bottom-4 right-4 bg-[#112950] text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-2",
};
