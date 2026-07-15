import {
  IoAddOutline,
  IoSearchOutline,
  IoFilterOutline,
} from "react-icons/io5";
import styles from "../CourseManager.module.css";

const QuestionBankTab = () => {
  return (
    <div className={styles.tabCard}>
      <div className={styles.tabHeaderFlex}>
        <div>
          <h3 className={styles.tabTitle}>Global Question Bank</h3>
          <p className={styles.tabSubtitle}>
            Manage a repository of questions for your exams.
          </p>
        </div>
        <button className={styles.primaryOutlineBtn}>
          <IoAddOutline /> Add Question
        </button>
      </div>

      <div className={styles.tableToolbar}>
        <div className={styles.searchWrapper}>
          <IoSearchOutline className={styles.searchIconInside} />
          <input
            type="text"
            placeholder="Search questions..."
            className={styles.tableSearchInput}
          />
        </div>
        <button className={styles.filterBtn}>
          <IoFilterOutline /> Filter
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Question Text</th>
              <th>Question Type</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.qTextMain}>What is React Context API?</td>
              <td>
                <span className={styles.pillGray}>Multiple Choice</span>
              </td>
              <td>
                <span className={styles.pillGreen}>Easy</span>
              </td>
            </tr>
            <tr>
              <td className={styles.qTextMain}>
                Explain SSR vs CSR in Next.js
              </td>
              <td>
                <span className={styles.pillGray}>Essay</span>
              </td>
              <td>
                <span className={styles.pillRed}>Hard</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionBankTab;
