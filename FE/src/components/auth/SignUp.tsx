/**
 * SignUp.tsx — Đăng Ký Hội Viên
 * Bám sát HTML design document 7 (glass card, corner ornaments, luxury gradient)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AuthLayout from './AuthLayout';
import { useAuthStore } from '../../store/authStore';
import { playTheme } from '../../utils/musicManager';

function Field({ label, type='text', placeholder, value, onChange, disabled = false }: { 
  label:string; 
  type?:string; 
  placeholder:string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{
        fontFamily:"'Barlow Condensed',sans-serif",
        fontSize:11, letterSpacing:4, textTransform:'uppercase', color:'#f6be39',
      }}>{label}</label>
      <input 
        type={type} 
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        onFocus={() => setFocus(true)} 
        onBlur={() => setFocus(false)}
        style={{
          width:'100%', 
          background:'#0e0e0e', 
          border:'none', 
          outline:'none',
          borderBottom:`2px solid ${focus ? '#f6be39' : 'rgba(212,160,23,0.4)'}`,
          padding:'12px 0', 
          color:'#e5e2e1', 
          fontSize:14,
          fontFamily:"'Work Sans',sans-serif", 
          transition:'border-color .2s',
          boxSizing:'border-box',
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
    </div>
  );
}

const item = (delay=0) => ({
  hidden:{ opacity:0, y:20 },
  show:  { opacity:1, y:0, transition:{ duration:0.45, delay } },
});

const EMOJI_OPTIONS = ['🎩', '🚀', '🎸', '👑', '🎮', '🎯', '🎪', '🎨', '🎭', '🎺'];

export default function SignUp() {
  const navigate        = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    emoji: '🎮',
  });
  const [agreed, setAgreed] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (localError) setLocalError('');
    if (error) clearError();
  };

  const validateForm = () => {
    if (!formData.displayName.trim()) {
      setLocalError('Vui lòng nhập họ và tên!');
      return false;
    }
    if (!formData.email.trim()) {
      setLocalError('Vui lòng nhập email!');
      return false;
    }
    if (!formData.email.includes('@')) {
      setLocalError('Email không hợp lệ!');
      return false;
    }
    if (!formData.username.trim()) {
      setLocalError('Vui lòng nhập tên đăng nhập!');
      return false;
    }
    if (formData.password.length < 6) {
      setLocalError('Mật khẩu phải có ít nhất 6 ký tự!');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Mật khẩu xác nhận không khớp!');
      return false;
    }
    if (!agreed) {
      setLocalError('Vui lòng đồng ý với điều khoản dịch vụ!');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      clearError();
      setLocalError('');
      await register({
        email: formData.email.trim(),
        password: formData.password,
        username: formData.username.trim(),
        displayName: formData.displayName.trim(),
        emoji: formData.emoji,
      });
      playTheme();
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/auth/signin');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Đăng ký thất bại! Vui lòng thử lại.');
    }
  };

  const displayError = localError || error;

  return (
    <AuthLayout>
      <motion.div
        initial="hidden" animate="show"
        style={{ width:'100%', maxWidth:520, position:'relative' }}
      >
        {/* Corner ornaments */}
        <div style={{ position:'absolute', top:-24, left:-24, width:96, height:96,
          borderTop:'4px solid #d4a017', borderLeft:'4px solid #d4a017', zIndex:2, pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-24, right:-24, width:96, height:96,
          borderBottom:'4px solid #d4a017', borderRight:'4px solid #d4a017', zIndex:2, pointerEvents:'none' }} />

        {/* Glass card */}
        <div style={{
          background:'rgba(53,53,52,0.8)', backdropFilter:'blur(12px)',
          border:'1px solid rgba(79,70,52,0.3)',
          padding:'48px 48px 36px',
          boxShadow:'0 20px 40px rgba(0,0,0,0.6)',
          position:'relative', zIndex:3,
        }}>

          {/* Heading */}
          <motion.div variants={item(0)} style={{ textAlign:'center', marginBottom:36 }}>
            <h1 style={{
              fontFamily:"'Playfair Display',serif", fontSize:36,
              color:'#f6be39', letterSpacing:2,
              textShadow:'0 0 8px rgba(246,190,57,0.4)',
              textTransform:'uppercase', marginBottom:8,
            }}>TRỞ THÀNH ĐẠI GIA</h1>
            <p style={{
              fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:11, letterSpacing:6, textTransform:'uppercase', color:'#bdcabe',
            }}>Gia nhập giới thượng lưu Indochine</p>
          </motion.div>

          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* Name + Email */}
            <motion.div variants={item(0.05)}
              style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              <Field 
                label="Họ và Tên" 
                placeholder="NGUYỄN VĂN A"
                value={formData.displayName}
                onChange={(v) => handleInputChange('displayName', v)}
                disabled={isLoading}
              />
              <Field 
                label="Email" 
                type="email" 
                placeholder="dai.gia@indochine.vn"
                value={formData.email}
                onChange={(v) => handleInputChange('email', v)}
                disabled={isLoading}
              />
            </motion.div>

            <motion.div variants={item(0.1)}>
              <Field 
                label="Tên đăng nhập" 
                type="text" 
                placeholder="nguyenvana"
                value={formData.username}
                onChange={(v) => handleInputChange('username', v)}
                disabled={isLoading}
              />
            </motion.div>

            {/* Password + Confirm */}
            <motion.div variants={item(0.15)}
              style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              <Field 
                label="Mật khẩu" 
                type="password" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(v) => handleInputChange('password', v)}
                disabled={isLoading}
              />
              <Field 
                label="Xác nhận mật khẩu" 
                type="password" 
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(v) => handleInputChange('confirmPassword', v)}
                disabled={isLoading}
              />
            </motion.div>

            {/* Emoji Selection */}
            <motion.div variants={item(0.2)}>
              <label style={{
                fontFamily:"'Barlow Condensed',sans-serif",
                fontSize:11, letterSpacing:4, textTransform:'uppercase', color:'#f6be39',
                display:'block', marginBottom:12,
              }}>Chọn Emoji đại diện</label>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleInputChange('emoji', emoji)}
                    disabled={isLoading}
                    style={{
                      width:40, height:40, border: formData.emoji === emoji ? '2px solid #f6be39' : '2px solid rgba(212,160,23,0.4)',
                      background:'transparent', cursor:isLoading ? 'not-allowed' : 'pointer',
                      fontSize:20, transition:'all .2s', opacity: isLoading ? 0.5 : 1,
                    }}
                    onMouseOver={e => !isLoading && (e.currentTarget.style.borderColor='#f6be39')}
                    onMouseOut={e  => !isLoading && (e.currentTarget.style.borderColor= formData.emoji === emoji ? '#f6be39' : 'rgba(212,160,23,0.4)')}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Terms */}
            <motion.div variants={item(0.25)}
              style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'8px 0' }}>
              <div onClick={() => !isLoading && setAgreed(a => !a)} style={{
                width:16, height:16, flexShrink:0, marginTop:2, cursor:isLoading ? 'not-allowed' : 'pointer',
                border:`2px solid ${agreed ? '#f6be39' : 'rgba(212,160,23,0.4)'}`,
                background: agreed ? '#f6be39' : 'transparent',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all .2s', opacity: isLoading ? 0.5 : 1,
              }}>
                {agreed && <span style={{ color:'#261a00', fontSize:11, fontWeight:700 }}>✓</span>}
              </div>
              <p style={{ fontSize:12, color:'#d3c5ae', lineHeight:1.6, fontFamily:"'Work Sans',sans-serif" }}>
                Tôi đồng ý với{' '}
                <span style={{ color:'#f6be39', textDecoration:'underline', cursor:'pointer' }}>
                  điều khoản dịch vụ
                </span>{' '}
                và chính sách bảo mật hội viên VIP.
              </p>
            </motion.div>

            {/* Error Display */}
            {displayError && (
              <motion.div variants={item(0.3)}>
                <p style={{
                  fontFamily:"'Barlow Condensed',sans-serif", fontSize:12,
                  color:'#ff6b6b', textAlign:'center', letterSpacing:1,
                }}>{displayError}</p>
              </motion.div>
            )}

            {/* Submit */}
            <motion.div variants={item(0.35)}>
              <motion.button
                onClick={handleRegister}
                disabled={isLoading || !agreed}
                whileHover={{ filter:'brightness(1.1)' }} whileTap={{ scale:0.97 }}
                style={{
                  width:'100%', padding:'16px 0',
                  background:'linear-gradient(135deg,#f6be39,#d4a017)',
                  color:'#261a00', border:'none', cursor:isLoading || !agreed ? 'not-allowed' : 'pointer',
                  fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:700, fontSize:18, letterSpacing:5, textTransform:'uppercase',
                  boxShadow:'0 4px 15px rgba(212,160,23,0.3)',
                  opacity: (isLoading || !agreed) ? 0.55 : 1, transition:'opacity .2s',
                }}>
                {isLoading ? 'ĐANG ĐĂNG KÝ...' : 'KHỞI NGHIỆP NGAY'}
              </motion.button>
            </motion.div>
          </div>

          {/* Footer link */}
          <motion.div variants={item(0.4)} style={{ marginTop:24, textAlign:'center' }}>
            <p style={{ fontSize:13, color:'#9b8f7a', fontFamily:"'Work Sans',sans-serif" }}>
              Đã có tài khoản?{' '}
              <button 
                onClick={() => navigate('/auth/signin')} 
                disabled={isLoading}
                style={{
                  background:'none', border:'none', cursor:isLoading ? 'not-allowed' : 'pointer',
                  color:'#f6be39', fontFamily:"'Work Sans',sans-serif",
                  fontSize:13, fontWeight:500,
                  borderBottom:'1px solid rgba(246,190,57,0.35)',
                  opacity: isLoading ? 0.5 : 1,
                }}>
                Đăng nhập
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
