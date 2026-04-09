import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header/Header";
import NavTabs from "./components/Nav/NavTabs";
import MonthNav from "./components/Header/MonthNav";
import StatsGrid from "./components/Stats/StatsGrid";
import CalendarView from "./components/Calendar/CalendarView";
import YearSidebar from "./components/Sidebar/YearSidebar";
import HolidayManager from "./components/HolidayManager/HolidayManager";
import BackupBar from "./components/UI/BackupBar";
import SetupModal from "./components/UI/SetupModal";
import StatusPopup from "./components/StatusPopup/StatusPopup";
import { loadState } from "./store/slices/persistSlice";

const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

function DashboardPage() {
  return (
    <motion.div
      key="dashboard"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container section-pad">
        <StatsGrid />
        <div className="dash-grid">
          <YearSidebar />
          <BackupBar />
        </div>
      </div>
    </motion.div>
  );
}

function CalendarPage() {
  return (
    <motion.div
      key="calendar"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container section-pad-sm">
        <CalendarView />
      </div>
    </motion.div>
  );
}

function HolidaysPage() {
  return (
    <motion.div
      key="holidays"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container section-pad">
        <HolidayManager />
      </div>
    </motion.div>
  );
}

function App() {
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.ui.theme);
  const username = useSelector((s) => s.ui.username);
  const page = useSelector((s) => s.ui.page);

  useEffect(() => {
    dispatch(loadState());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="app-root">
      <AnimatePresence>
        {!username && <SetupModal key="setup" />}
      </AnimatePresence>

      <StatusPopup />
      <Header />
      <NavTabs />
      <MonthNav />

      <main className="main-content">
        <AnimatePresence mode="wait">
          {page === "dashboard" && <DashboardPage key="dashboard" />}
          {page === "calendar" && <CalendarPage key="calendar" />}
          {page === "holidays" && <HolidaysPage key="holidays" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
