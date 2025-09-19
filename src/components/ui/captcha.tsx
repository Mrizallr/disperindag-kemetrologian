import React, { useRef, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Label } from './label';

interface CaptchaProps {
  onVerify: (isValid: boolean) => void;
  reset?: boolean;
}

const Captcha: React.FC<CaptchaProps> = ({ onVerify, reset }) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  // Site key dari environment variable atau fallback ke test key
  const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  const handleCaptchaChange = (token: string | null) => {
    onVerify(!!token);
  };

  useEffect(() => {
    if (reset && recaptchaRef.current) {
      recaptchaRef.current.reset();
      onVerify(false);
    }
  }, [reset, onVerify]);

  return (
    <div className="space-y-2">
      <Label>Verifikasi reCAPTCHA</Label>
      <div className="flex justify-center">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={SITE_KEY}
          onChange={handleCaptchaChange}
          theme="light"
        />
      </div>
    </div>
  );
};

export default Captcha;