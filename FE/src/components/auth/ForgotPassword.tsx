/**
 * ForgotPassword.tsx — Khôi Phục Tài Khoản
 * Bám sát HTML design document 8 (double-border card, diamond decorations)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from './AuthLayout';

export default function ForgotPassword() {
  const navigate          = useNavigate();
  const [focus, setFocus] = useState(false);
  const [email, setEmail] = useState('');
  const [sent,  setSent]  = useState(false);

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.45 }}
        style={{ width:'100%', maxWidth:440 }}
      >
        {/* Double-border wrapper */}
        <div style={{
          background:'#0e0e0e', padding:1,
          border:'2px solid rgba(212,160,23,0.3)',
          boxShadow:'0 20px 40px rgba(0,0,0,0.6)',
          position:'relative',
        }}>
          {/* Decorative rotated borders — kimono-style */}
          <div style={{ position:'absolute', top:-24, left:-24, width:96, height:96,
            border:'4px solid rgba(212,160,23,0.15)', transform:'rotate(45deg)',
            pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-24, right:-24, width:96, height:96,
            border:'4px solid rgba(212,160,23,0.15)', transform:'rotate(12deg)',
            pointerEvents:'none' }} />

          <div style={{
            background:'#201f1f',
            border:'1px solid rgba(212,160,23,0.1)',
            padding:'44px 44px 36px',
          }}>

            {/* Icon + heading */}
            <div style={{ textAlign:'center', marginBottom:36 }}>
              <div style={{
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                width:80, height:80, marginBottom:20,
                background:'#2a2a2a', border:'2px solid #d4a017',
              }}>
                <span className="material-symbols-outlined" style={{
                  fontSize:36, color:'#f6be39',
                  fontVariationSettings:"'FILL' 1",
                }}>lock_reset</span>
              </div>
              <h1 style={{
                fontFamily:"'Noto Serif',serif", fontSize:26, fontWeight:700,
                textTransform:'uppercase', letterSpacing:2,
                color:'#f6be39', textShadow:'0 0 8px rgba(246,190,57,0.4)',
                marginBottom:12,
              }}>KHÔI PHỤC TÀI KHOẢN</h1>
              <p style={{
                color:'#d3c5ae', fontSize:13, lineHeight:1.6,
                maxWidth:280, margin:'0 auto',
                fontFamily:"'Work Sans',sans-serif",
              }}>
                Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
              </p>
            </div>

            {/* Form / Success toggle */}
            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.div key="form"
                  initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  style={{ display:'flex', flexDirection:'column', gap:32 }}
                >
                  {/* Email input */}
                  <div>
                    <label style={{
                      display:'block',
                      fontFamily:"'Barlow Condensed',sans-serif",
                      fontSize:11, letterSpacing:5, textTransform:'uppercase',
                      color:'#f6be39', marginBottom:10,
                    }}>Email khôi phục</label>
                    <div style={{ position:'relative' }}>
                      <input
                        type="email" value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="example@casino.vn"
                        onFocus={() => setFocus(true)}
                        onBlur={()  => setFocus(false)}
                        onKeyDown={e => e.key==='Enter' && email && setSent(true)}
                        style={{
                          width:'100%', background:'transparent', border:'none', outline:'none',
                          borderBottom:`2px solid ${focus ? '#f6be39' : 'rgba(212,160,23,0.4)'}`,
                          padding:'12px 36px 12px 0', color:'#e5e2e1', fontSize:14,
                          fontFamily:"'Work Sans',sans-serif", transition:'border-color .2s',
                          boxSizing:'border-box',
                        }}
                      />
                      <span className="material-symbols-outlined" style={{
                        position:'absolute', right:0, bottom:12, fontSize:20,
                        color: focus ? '#f6be39' : 'rgba(212,160,23,0.35)',
                        transition:'color .2s',
                      }}>mail</span>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => email && setSent(true)}
                    whileHover={{ filter:'brightness(1.1)' }} whileTap={{ scale:0.97 }}
                    style={{
                      width:'100%', padding:'16px 0',
                      background:'linear-gradient(135deg,#f6be39,#d4a017)',
                      color:'#261a00', border:'none', cursor:'pointer',
                      fontFamily:"'Barlow Condensed',sans-serif",
                      fontWeight:700, fontSize:16, letterSpacing:5, textTransform:'uppercase',
                      boxShadow:'0 4px 15px rgba(212,160,23,0.3)',
                      opacity: email ? 1 : 0.5, transition:'opacity .2s',
                    }}>
                    GỬI YÊU CẦU
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div key="success"
                  initial={{ opacity:0, scale:0.95 }}
                  animate={{ opacity:1, scale:1 }}
                  style={{ textAlign:'center', padding:'12px 0 20px' }}
                >
                  <div style={{ fontSize:48, marginBottom:16 }}>✉️</div>
                  <p style={{
                    fontFamily:"'Barlow Condensed',sans-serif",
                    fontSize:13, letterSpacing:3, textTransform:'uppercase',
                    color:'#39ff85', marginBottom:8,
                  }}>ĐÃ GỬI THÀNH CÔNG!</p>
                  <p style={{ color:'#9b8f7a', fontSize:13, fontFamily:"'Work Sans',sans-serif", lineHeight:1.6 }}>
                    Kiểm tra hộp thư{' '}
                    <strong style={{ color:'#f6be39' }}>{email}</strong>{' '}
                    để nhận hướng dẫn.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Back to login */}
            <div style={{
              marginTop:32, paddingTop:24,
              borderTop:'1px solid rgba(212,160,23,0.12)',
              textAlign:'center',
            }}>
              <button onClick={() => navigate('/auth/signin')} style={{
                background:'none', border:'none', cursor:'pointer',
                display:'inline-flex', alignItems:'center', gap:8,
                fontFamily:"'Barlow Condensed',sans-serif",
                fontSize:12, letterSpacing:3, textTransform:'uppercase',
                color:'#9b8f7a', transition:'color .2s',
              }}
                onMouseOver={e => e.currentTarget.style.color='#f6be39'}
                onMouseOut={e  => e.currentTarget.style.color='#9b8f7a'}
              >
                <span className="material-symbols-outlined" style={{ fontSize:18 }}>arrow_back</span>
                Quay lại Đăng nhập
              </button>
            </div>
          </div>
        </div>

        {/* Bottom branding */}
        <p style={{
          textAlign:'center', marginTop:24,
          fontFamily:"'Barlow Condensed',sans-serif",
          fontSize:9, letterSpacing:5, textTransform:'uppercase',
          color:'rgba(212,160,23,0.3)',
        }}>
          Phòng VIP Indochine • Tài Chính &amp; Quyền Lực
        </p>
      </motion.div>
    </AuthLayout>
  );
}
