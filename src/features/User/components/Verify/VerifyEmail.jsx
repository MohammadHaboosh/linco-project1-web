import { useLocation } from 'react-router-dom';
import { IoMailUnreadOutline, IoArrowBackOutline } from 'react-icons/io5';
import styles from './VerifyEmail.module.css';

import logoImg from '../../../../../public/images/LinCo.png';
import mascotImg from '../../../../../public/images/linco-logo.jpg';

const VerifyEmail = () => {
  const location = useLocation();
  const userEmail = location.state?.email || 'your email';

  const handleResend = () => {
    console.log('Resending verification email to:', userEmail);
    alert('Verification email resent!');
  };

  return (
    <div className={styles['page-container']}>
      <div className={styles['left-panel']}>
        <div className={styles['left-content']}>
          <div className={styles['logo-container']}>
            <img src={logoImg} alt="LinCo Logo" className={styles.logo} />
          </div>
          <div className={styles['mascot-box']}>
            <img src={mascotImg} alt="LinCo Mascot" className={styles.mascot} />
          </div>
          <div className={styles['brand-text']}>
            <h2>
              <strong>LinCo..</strong> Link Company,
            </h2>
            <p>Empowering your learning journey with seamless connections.</p>
          </div>
        </div>
      </div>

      <div className={styles['right-panel']}>
        <div className={styles['verify-wrapper']}>
          <div className={styles['icon-container']}>
            <IoMailUnreadOutline className={styles['mail-icon']} />
          </div>

          <h1 className={styles.title}>Check your email</h1>

          <p className={styles.description}>
            We're glad you're here! We've sent a verification link to:
            <br />
            <strong className={styles['email-highlight']}>{userEmail}</strong>
          </p>

          <p className={styles.instructions}>
            Please click the link in that email to activate your account and
            start using LinCo.
          </p>

          <button
            className={styles['btn-primary']}
            onClick={() => (window.location.href = '/signin')}
          >
            Go to Login
          </button>

          <div className={styles['resend-section']}>
            <p>Didn't receive the email?</p>
            <button className={styles['btn-text']} onClick={handleResend}>
              Click to resend
            </button>
          </div>

          <button
            className={styles['btn-back']}
            onClick={() => (window.location.href = '/signup')}
          >
            <IoArrowBackOutline className={styles['back-icon']} />
            Back to sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
