import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { setRecords } from "../../store/slices/attendanceSlice";
import { setHolidays } from "../../store/slices/holidaysSlice";
import { setUsername } from "../../store/slices/uiSlice";
import { exportAllData, saveToStorage } from "../../utils/storage";
import toast from "react-hot-toast";
import styles from "./BackupBar.module.css";

export default function BackupBar() {
  const dispatch = useDispatch();
  const state = useSelector((s) => s);
  const importRef = useRef();

  function handleExport() {
    exportAllData(state);
    toast.success("Data exported!");
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d.attendance) {
          dispatch(setRecords(d.attendance));
          saveToStorage("wfo_attendance", d.attendance);
        }
        if (d.holidays) {
          dispatch(setHolidays(d.holidays));
          saveToStorage("wfo_holidays", d.holidays);
        }
        if (d.username) {
          dispatch(setUsername(d.username));
          saveToStorage("wfo_username", d.username);
        }
        toast.success("Data imported successfully!");
      } catch {
        toast.error("Invalid backup file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className={`card card-pad ${styles.bar}`}>
      <div className={styles.info}>
        <h3 className={styles.title}>💾 Data Backup & Sync</h3>
        <p className={styles.desc}>
          Your data lives in your browser's localStorage. Export includes{" "}
          <strong>all attendance records for all months and years</strong>, plus
          your holiday list — so you can restore everything on another device.
        </p>
      </div>
      <div className={styles.actions}>
        <motion.button
          className="btn btn-brand"
          onClick={handleExport}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          📤 Export Backup
        </motion.button>
        <motion.label
          className="btn btn-outline"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          style={{ cursor: "pointer" }}
        >
          📥 Import Backup
          <input
            type="file"
            accept=".json"
            hidden
            onChange={handleImport}
            ref={importRef}
          />
        </motion.label>
      </div>
    </div>
  );
}
