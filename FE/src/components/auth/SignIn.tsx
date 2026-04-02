/**
 * SignIn.tsx — Đăng Nhập
 * Dựa trên HTML design document 6 (side-nav layout với glass card)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AuthLayout from './AuthLayout';
import { useAuthStore } from '../../store/authStore';
import { playTheme } from '../../utils/musicManager';

const FB = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG9CzO5n3e14tYu8ZYooPNyy7UNeCKutZlR78ZpDsdN1ypq-AXDQraYwMuOHli8Q8aW4c0yEVDajpggzzNuMGQM3643Loh3_IwfId279QSoUhPGMNifyfcQBoG1xndNnVHtNZOf8SP0XCX-FENCQBb2sArGPd--M0OLoEMNiieOsCCPKAIR2F_BDNNPs07ur7dyAru8eOlX-T9eFqlLgly3Nqul48-VtA9uhNHwMwekIzTY6-PDMHmOSGpPSGgrIMI7FWxRalBxQQ';
const GG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHONCDE3Fw5MBVedxhuLfFbHthR5njKYr038R4VxY-zPy0Qw2_zuo8AOxRPBu0TCuYnOPkL0SONHOgy3SWfenwerpNAN5KxMZ3UryKn8-QuEAObHOnVsX8fVYtnEQRr5bCXYsQsGIPQjFbdvJhhtGvJLrjtVzQaVVeLGskq4w9AGDvCVrsvAQFLdlIzNluuPW5XQu0ljFjPJMZXiTT4iunr0quk5DBgt-PnyXh0BkZeRregDGOrJeSmroro6AmOSXrKUCy6y3NFmI';

function UnderlineInput({
  label, type='text', placeholder, value, onChange, rightSlot,
}: {
  label: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void;
  rightSlot?: React.ReactNode;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      <label style={{
        display:'block', fontFamily:"'Barlow Condensed',sans-serif",
        fontSize:11, letterSpacing:4, textTransform:'uppercase',
        color:'#d3c5ae', marginBottom:8,
      }}>{label}</label>
      <div style={{ position:'relative' }}>
        <input type={type} placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={()  => setFocus(false)}
          style={{
            width:'100%', background:'transparent', border:'none', outline:'none',
            borderBottom:`2px solid ${focus ? '#f6be39' : 'rgba(212,160,23,0.35)'}`,
            padding:'10px 0', color:'#cac6be', fontSize:14,
            fontFamily:"'Work Sans',sans-serif", transition:'border-color .2s',
            boxSizing:'border-box',
          }}
        />
        {rightSlot}
      </div>
    </div>
  );
}

export default function SignIn() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setLocalError('Vui lòng nhập email và mật khẩu!');
      toast.error('Vui lòng nhập email và mật khẩu!');
      return;
    }

    try {
      clearError();
      setLocalError('');
      await login(email.trim(), password);
      playTheme();
      toast.success('Đăng nhập thành công!');
      navigate('/home');
    } catch (error) {
      // Error is handled by the store
      console.error('Login failed:', error);
      toast.error('Đăng nhập thất bại! Email hoặc mật khẩu không đúng.');
    }
  };

  const displayError = localError || error;

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.45, ease:'easeOut' }}
        style={{ width:'100%', maxWidth:440 }}
      >
        {/* Glass card */}
        <div style={{
          background:'rgba(53,53,52,0.45)',
          backdropFilter:'blur(12px)',
          border:'2px solid #d4a017',
          padding:'40px 44px 36px',
          boxShadow:'0 20px 40px rgba(0,0,0,0.6)',
        }}>

          {/* Logo & heading */}
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <div style={{
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              width:64, height:64, border:'2px solid #f6be39', marginBottom:16,
            }}>
              <span className="material-symbols-outlined" style={{
                fontSize:36, color:'#f6be39',
                fontVariationSettings:"'FILL' 1",
              }}>casino</span>
            </div>
            <h2 style={{
              fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700,
              letterSpacing:4, color:'#f6be39', textTransform:'uppercase',
              textShadow:'0 0 8px rgba(246,190,57,0.4)', marginBottom:6,
            }}>CỜ TỶ PHÚ</h2>
            <p style={{
              fontFamily:"'Barlow Condensed',sans-serif", fontSize:11,
              letterSpacing:6, textTransform:'uppercase', color:'#bdcabe',
            }}>The Indochine Atelier</p>
          </div>

          {/* Form fields */}
          <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
            <UnderlineInput label="Email" placeholder="email@example.com"
              value={email} onChange={setEmail} />

            {/* Password row with forgot link */}
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:8 }}>
                <label style={{
                  fontFamily:"'Barlow Condensed',sans-serif",
                  fontSize:11, letterSpacing:4, textTransform:'uppercase', color:'#d3c5ae',
                }}>Mật khẩu</label>
                <button onClick={() => navigate('/auth/forgot')} style={{
                  background:'none', border:'none', cursor:'pointer',
                  fontFamily:"'Barlow Condensed',sans-serif",
                  fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'#bdcabe', transition:'color .2s',
                }}
                  onMouseOver={e => e.currentTarget.style.color='#f6be39'}
                  onMouseOut={e  => e.currentTarget.style.color='#bdcabe'}
                >Quên mật khẩu?</button>
              </div>
              <PasswordInput value={password} onChange={setPassword} />
            </div>

            {displayError && (
              <p style={{
                fontFamily:"'Barlow Condensed',sans-serif", fontSize:12,
                color:'#ff6b6b', textAlign:'center', letterSpacing:1,
              }}>{displayError}</p>
            )}

            <motion.button
              onClick={handleLogin}
              disabled={isLoading}
              whileHover={{ filter:'brightness(1.1)' }} whileTap={{ scale:0.97 }}
              style={{
                width:'100%', padding:'14px 0',
                background:'linear-gradient(135deg,#f6be39,#d4a017)',
                color:'#261a00', border:'none', cursor:isLoading ? 'not-allowed' : 'pointer',
                fontFamily:"'Barlow Condensed',sans-serif",
                fontWeight:700, fontSize:16, letterSpacing:5, textTransform:'uppercase',
                boxShadow:'0 4px 15px rgba(212,160,23,0.3)',
                opacity: isLoading ? 0.7 : 1,
              }}>
              {isLoading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
            </motion.button>
          </div>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:16, margin:'28px 0' }}>
            <div style={{ flex:1, height:1, background:'rgba(79,70,52,0.4)' }} />
            <span style={{
              fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:10, letterSpacing:4, textTransform:'uppercase', color:'#9b8f7a',
            }}>Hoặc tiếp tục với</span>
            <div style={{ flex:1, height:1, background:'rgba(79,70,52,0.4)' }} />
          </div>

          {/* Social */}
          <div style={{ display:'flex', justifyContent:'center', gap:16, marginBottom:28 }}>
            {[{src:FB,alt:'Facebook'},{src:GG,alt:'Google'}].map(s => (
              <motion.button key={s.alt}
                whileHover={{ borderColor:'#f6be39' }} whileTap={{ scale:0.95 }}
                style={{
                  width:48, height:48, display:'flex', alignItems:'center', justifyContent:'center',
                  border:'2px solid rgba(212,160,23,0.35)', background:'transparent', cursor:'pointer',
                  transition:'border-color .2s',
                }}>
                <img src={s.src} alt={s.alt}
                  style={{ width:24, height:24, filter:'grayscale(1) brightness(1.5)', transition:'filter .2s' }}
                  onMouseOver={e => (e.currentTarget.style.filter='none')}
                  onMouseOut={e  => (e.currentTarget.style.filter='grayscale(1) brightness(1.5)')}
                />
              </motion.button>
            ))}
          </div>

          {/* Footer link */}
          <p style={{ textAlign:'center', fontFamily:"'Barlow Condensed',sans-serif",
            fontSize:11, letterSpacing:3, textTransform:'uppercase', color:'#bdcabe' }}>
            Chưa có tài khoản?{' '}
            <button onClick={() => navigate('/auth/signup')} style={{
              background:'none', border:'none', cursor:'pointer',
              color:'#f6be39', fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:11, letterSpacing:3, textDecoration:'underline',
            }}>Đăng ký ngay</button>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
}

function PasswordInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focus, setFocus] = useState(false);
  return (
    <input type="password" placeholder="••••••••"
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocus(true)}
      onBlur={()  => setFocus(false)}
      style={{
        width:'100%', background:'transparent', border:'none', outline:'none',
        borderBottom:`2px solid ${focus ? '#f6be39' : 'rgba(212,160,23,0.35)'}`,
        padding:'10px 0', color:'#cac6be', fontSize:14,
        fontFamily:"'Work Sans',sans-serif", transition:'border-color .2s',
        boxSizing:'border-box',
      }}
    />
  );
}
