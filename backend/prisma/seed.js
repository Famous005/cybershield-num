const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CyberShield NUM database...');

  // Create Admin
  const adminPassword = await bcrypt.hash('Admin@NUM2025', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@newgateuniversityminna.edu.ng' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@newgateuniversityminna.edu.ng',
      matricNo: 'ADMIN001',
      faculty: 'Administration',
      department: 'IT Department',
      password: adminPassword,
      role: 'ADMIN',
      xp: 9999,
      level: 99,
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Create demo student
  const studentPassword = await bcrypt.hash('Student@123', 10);
  await prisma.user.upsert({
    where: { email: 'demo@student.newgateuniversityminna.edu.ng' },
    update: {},
    create: {
      name: 'Demo Student',
      email: 'demo@student.newgateuniversityminna.edu.ng',
      matricNo: 'NUM/CSC/2022/001',
      faculty: 'Computing & Information Technology',
      department: 'Computer Science',
      password: studentPassword,
      role: 'STUDENT',
      xp: 350,
      level: 4,
      streak: 5,
    },
  });

  // Create Modules
  const modules = [
    {
      title: 'Phishing Awareness',
      description: 'Learn to identify and avoid phishing attacks targeting students and staff.',
      icon: 'Fish',
      color: '#e74c3c',
      order: 1,
      xpReward: 100,
      content: JSON.stringify({
        sections: [
          {
            title: 'What is Phishing?',
            body: 'Phishing is a type of cyberattack where criminals disguise themselves as trusted individuals or organizations to steal your personal information. They use emails, SMS messages, social media, and fake websites to trick you into revealing passwords, bank details, or other sensitive data.',
            tip: '⚠️ Real organizations like your bank or university will NEVER ask for your password via email or phone.',
          },
          {
            title: 'How to Spot a Phishing Email',
            body: 'Key red flags include: urgent language ("Your account will be suspended!"), suspicious sender email addresses (e.g., support@newgate-university.com instead of @newgateuniversityminna.edu.ng), poor spelling and grammar, and links that don\'t match the displayed text.',
            tip: '🔍 Always hover over links before clicking. Check if the URL matches the real website.',
          },
          {
            title: 'Phishing via Social Media',
            body: 'Attackers also use Instagram DMs, WhatsApp, and Facebook messages to impersonate school officials, fake admissions offices, or scholarship offers. They create urgency and ask you to pay fees or share personal documents.',
            tip: '📱 Verify any school-related offer through official NUM channels before responding.',
          },
          {
            title: 'What to Do If You Suspect Phishing',
            body: 'Do not click any links. Do not reply or call numbers provided. Report to your institution\'s IT department. If you already clicked, change your passwords immediately and report to cybersecurity@newgateuniversityminna.edu.ng.',
            tip: '🚨 Report suspicious messages immediately. You could save someone else from being scammed.',
          },
        ],
        keyPoints: [
          'Never share passwords via email or phone',
          'Check sender email addresses carefully',
          'Verify offers through official channels',
          'Report suspicious messages immediately',
        ],
      }),
    },
    {
      title: 'Password Security',
      description: 'Master the art of creating and managing strong passwords.',
      icon: 'Lock',
      color: '#3498db',
      order: 2,
      xpReward: 80,
      content: JSON.stringify({
        sections: [
          {
            title: 'Why Password Security Matters',
            body: 'Weak passwords are the #1 cause of account breaches. A hacker can crack a simple 6-character password in seconds using automated tools. Your student portal, email, and personal accounts are all at risk.',
            tip: '💡 A strong password is your first and most important line of defense.',
          },
          {
            title: 'Creating a Strong Password',
            body: 'A strong password should be at least 12 characters long, containing uppercase and lowercase letters, numbers, and special characters (!@#$%). Avoid using your name, date of birth, matric number, or common words like "password123".',
            tip: '🔐 Use a passphrase: "I@Newgate2023!" is stronger than "abc123".',
          },
          {
            title: 'Password Managers',
            body: 'Password managers like Bitwarden (free), LastPass, or 1Password securely store all your passwords, so you only need to remember one master password. This allows you to have unique strong passwords for every account.',
            tip: '🗝️ Using the same password on multiple sites means one breach compromises all your accounts.',
          },
          {
            title: 'Two-Factor Authentication (2FA)',
            body: 'Two-factor authentication adds an extra layer of security by requiring a second form of verification (like an SMS code or authenticator app) in addition to your password. Enable 2FA on your email, social media, and school portal.',
            tip: '📲 Enable 2FA everywhere possible. It stops 99% of automated account attacks.',
          },
        ],
        keyPoints: [
          'Use passwords of 12+ characters',
          'Never reuse passwords across sites',
          'Use a password manager',
          'Enable two-factor authentication',
        ],
      }),
    },
    {
      title: 'Social Engineering',
      description: 'Recognize manipulation tactics used by cybercriminals in everyday situations.',
      icon: 'Users',
      color: '#9b59b6',
      order: 3,
      xpReward: 120,
      content: JSON.stringify({
        sections: [
          {
            title: 'What is Social Engineering?',
            body: 'Social engineering is the art of manipulating people into giving up confidential information or performing actions that benefit the attacker. Unlike hacking, it exploits human psychology rather than technical vulnerabilities. It is the technique behind the fake admissions officer scam.',
            tip: '🎭 Criminals are skilled actors. Always verify identities independently.',
          },
          {
            title: 'Common Social Engineering Tactics',
            body: 'Pretexting: Creating a fake scenario (e.g., "I\'m from the JAMB helpdesk"). Baiting: Offering something tempting (fake scholarships, admissions). Urgency: Creating panic ("Pay now or lose your spot"). Authority: Impersonating officials, lecturers, or school management.',
            tip: '⏰ Legitimate institutions don\'t demand immediate payment under pressure.',
          },
          {
            title: 'The Fake Admissions Scam',
            body: 'Scammers contact prospective students via phone, WhatsApp, or Instagram claiming to be from JAMB, WAEC, or the university admissions office. They promise admission or clearance in exchange for money or sensitive personal documents.',
            tip: '📞 NUM admissions only happen through official portals. Never pay anyone directly.',
          },
          {
            title: 'Protecting Yourself',
            body: 'Verify the identity of anyone requesting sensitive information. Call official numbers found on the school website. Never share personal documents or make payments to unofficial accounts. Trust your instincts — if something feels wrong, it probably is.',
            tip: '✅ When in doubt, verify through official NUM channels: info@newgateuniversityminna.edu.ng',
          },
        ],
        keyPoints: [
          'Verify identities independently',
          'Be skeptical of urgent requests',
          'Never pay unofficial accounts',
          'Trust your instincts',
        ],
      }),
    },
    {
      title: 'Ransomware & Malware',
      description: 'Understand how malicious software works and how to protect your devices.',
      icon: 'Bug',
      color: '#e67e22',
      order: 4,
      xpReward: 150,
      content: JSON.stringify({
        sections: [
          {
            title: 'What is Malware?',
            body: 'Malware (malicious software) is any software intentionally designed to cause harm. Types include viruses (spread between files), trojans (disguised as legitimate software), spyware (secretly monitors you), and adware (unwanted advertisements that may compromise privacy).',
            tip: '🛡️ Keep your antivirus updated and never disable it.',
          },
          {
            title: 'Understanding Ransomware',
            body: 'Ransomware is a type of malware that encrypts your files and demands payment (ransom) to restore access. This is exactly what happened to the NUM school data system. The attack typically starts with clicking a malicious email attachment or downloading infected software.',
            tip: '💾 Always backup your important files to an external drive or cloud storage.',
          },
          {
            title: 'How Malware Spreads',
            body: 'Common infection methods include: downloading pirated software, clicking email attachments from unknown senders, visiting compromised websites, using infected USB drives, and installing apps from unofficial sources.',
            tip: '📥 Only download software from official app stores and trusted websites.',
          },
          {
            title: 'Prevention and Response',
            body: 'Keep your operating system and software updated. Use reputable antivirus software. Backup data regularly (3-2-1 rule: 3 copies, 2 different media, 1 offsite). If infected, disconnect from the internet immediately and contact IT support.',
            tip: '🔄 Regular backups are your best defense against ransomware. Back up weekly.',
          },
        ],
        keyPoints: [
          'Keep software and OS updated',
          'Never download pirated software',
          'Back up data regularly',
          'Disconnect immediately if infected',
        ],
      }),
    },
    {
      title: 'Safe Online Practices',
      description: 'Build daily habits that keep you secure in the digital world.',
      icon: 'Shield',
      color: '#27ae60',
      order: 5,
      xpReward: 90,
      content: JSON.stringify({
        sections: [
          {
            title: 'Securing Your Devices',
            body: 'Always lock your screen when stepping away. Use strong PINs or biometrics (fingerprint/face ID). Keep automatic updates enabled. Avoid using public computers for sensitive tasks like accessing your student portal or internet banking.',
            tip: '🔒 Set your screen to auto-lock after 2 minutes of inactivity.',
          },
          {
            title: 'Safe Use of Public WiFi',
            body: 'Public WiFi networks (cafes, hostels, campus open networks) are often unsecured, allowing attackers to intercept your data. Avoid accessing banking or school portals on public WiFi without a VPN. A VPN encrypts your traffic and protects you on open networks.',
            tip: '📡 Use your mobile data for sensitive tasks if VPN is unavailable.',
          },
          {
            title: 'Social Media Privacy',
            body: 'Review your privacy settings regularly. Don\'t overshare personal information (home address, phone number, travel plans). Be cautious of friend requests from strangers. Remember that screenshots are forever — think before you post.',
            tip: '🔐 Set your social media profiles to "Friends Only" or private.',
          },
          {
            title: 'Academic Integrity & Digital Ethics',
            body: 'Respect others\' digital privacy. Don\'t share copyrighted materials. Use academic resources responsibly. Report cyberbullying and online harassment through proper channels. Maintain a positive digital footprint — future employers can see your online activity.',
            tip: '🎓 Your digital reputation matters as much as your academic record.',
          },
        ],
        keyPoints: [
          'Lock devices when not in use',
          'Avoid sensitive tasks on public WiFi',
          'Review social media privacy settings',
          'Maintain a positive digital footprint',
        ],
      }),
    },
  ];

  for (const module of modules) {
    const created = await prisma.module.upsert({
      where: { id: `module-0${module.order}` },
      update: {},
      create: { id: `module-0${module.order}`, ...module },
    });
    console.log(`✅ Module created: ${created.title}`);
  }

  // Create Quiz Questions
  const quizData = [
    {
      moduleId: 'module-01',
      questions: [
        {
          question: 'You receive an email from "support@newgate-university.com" asking you to verify your student portal password. What should you do?',
          options: JSON.stringify(['Reply with your password immediately', 'Click the link and enter your details', 'Delete the email and report it to IT support', 'Forward it to all your classmates']),
          answer: 2,
          explanation: 'This is a phishing attempt. The email domain "newgate-university.com" is not the official NUM domain (newgateuniversityminna.edu.ng). Never share passwords via email.',
        },
        {
          question: 'Which of the following is a red flag that an email might be a phishing attempt?',
          options: JSON.stringify(['The email comes from an official university domain', 'The email creates urgency ("Act now or lose your account!")', 'The email contains your full name and matric number', 'The email was sent during business hours']),
          answer: 1,
          explanation: 'Creating false urgency is a classic phishing tactic. Legitimate organizations rarely pressure you to act immediately under threat of account suspension.',
        },
        {
          question: 'What does "hovering over a link" mean in the context of phishing detection?',
          options: JSON.stringify(['Clicking the link quickly', 'Moving your mouse over the link to preview the actual URL', 'Copying and pasting the link', 'Reporting the link to authorities']),
          answer: 1,
          explanation: 'Hovering your mouse cursor over a link shows the actual destination URL at the bottom of your browser, which may reveal that it goes to a malicious site.',
        },
        {
          question: 'A student receives a WhatsApp message from someone claiming to be from the NUM admissions office, asking for ₦5,000 to secure an admission slot. What is this?',
          options: JSON.stringify(['A legitimate NUM service', 'A phishing/social engineering scam', 'A scholarship offer', 'A student union service']),
          answer: 1,
          explanation: 'NUM does not solicit payments through unofficial channels like WhatsApp. This is a classic admissions scam using social engineering.',
        },
        {
          question: 'Which email address is most likely to be from the official Newgate University Minna?',
          options: JSON.stringify(['info@newgate-university.ng', 'admin@newgateuniminna.com', 'support@newgateuniversityminna.edu.ng', 'helpdesk@numa.edu']),
          answer: 2,
          explanation: 'The official domain for Newgate University Minna ends in "newgateuniversityminna.edu.ng". All other variations are potentially fraudulent.',
        },
        {
          question: 'What should you do immediately if you accidentally clicked a phishing link?',
          options: JSON.stringify(['Nothing, it\'s probably fine', 'Shut down your computer completely', 'Change your passwords and report to IT support immediately', 'Only tell a friend about it']),
          answer: 2,
          explanation: 'Immediate password changes limit the damage. Reporting to IT support helps protect others who might receive the same phishing attempt.',
        },
        {
          question: 'Spear phishing is different from regular phishing because:',
          options: JSON.stringify(['It uses physical letters instead of emails', 'It is targeted at a specific person using their personal information', 'It only affects computers, not phones', 'It is always easy to identify']),
          answer: 1,
          explanation: 'Spear phishing attacks are highly personalized, using your name, role, and other details to appear more convincing, making them harder to detect.',
        },
        {
          question: 'You get an email saying you\'ve won a scholarship and must click a link within 24 hours. The email contains several spelling errors. You should:',
          options: JSON.stringify(['Click immediately to not miss the opportunity', 'Forward to everyone', 'Ignore, delete, and verify with the official scholarship body directly', 'Reply asking for more details']),
          answer: 2,
          explanation: 'Spelling errors, urgency, and unexpected prizes are all phishing red flags. Always verify through official channels before taking any action.',
        },
        {
          question: 'What is "smishing"?',
          options: JSON.stringify(['Phishing via email', 'Phishing via SMS text messages', 'Phishing via social media', 'Phishing via phone calls']),
          answer: 1,
          explanation: 'Smishing is SMS phishing — attacks delivered through text messages. They often contain links to fake websites or phone numbers to call.',
        },
        {
          question: 'The best defense against phishing attacks is:',
          options: JSON.stringify(['Having expensive antivirus software', 'Being aware and verifying information before acting', 'Using a complicated password', 'Never using email']),
          answer: 1,
          explanation: 'Awareness and verification are the most effective defenses. Knowing what to look for and confirming legitimacy before acting protects you in most scenarios.',
        },
      ],
    },
    {
      moduleId: 'module-02',
      questions: [
        {
          question: 'Which of the following is the STRONGEST password?',
          options: JSON.stringify(['password123', 'NUM2023', 'MyDog@Kano#2024!', 'abcdefgh']),
          answer: 2,
          explanation: 'A strong password combines uppercase, lowercase, numbers, and special characters, and avoids common words or patterns. MyDog@Kano#2024! meets all these criteria.',
        },
        {
          question: 'What is a password manager?',
          options: JSON.stringify(['A person who manages company passwords', 'Software that securely stores and generates passwords', 'A type of virus that steals passwords', 'A feature in Microsoft Word']),
          answer: 1,
          explanation: 'Password managers like Bitwarden securely encrypt and store your passwords, enabling you to use unique strong passwords everywhere without memorizing them all.',
        },
        {
          question: 'Why is using the same password for multiple accounts dangerous?',
          options: JSON.stringify(['It is not dangerous at all', 'One breach gives attackers access to all your accounts', 'It makes passwords easier to remember', 'It slows down your internet']),
          answer: 1,
          explanation: 'Password reuse is extremely risky. If one site is breached (which happens frequently), attackers will try that same password on all other accounts you have.',
        },
        {
          question: 'Two-factor authentication (2FA) works by:',
          options: JSON.stringify(['Requiring you to enter your password twice', 'Requiring a second form of verification beyond your password', 'Blocking all login attempts automatically', 'Using two different usernames']),
          answer: 1,
          explanation: '2FA requires something you know (password) and something you have (phone/authenticator app), making accounts much harder to compromise even if your password is stolen.',
        },
        {
          question: 'How often should you change a password that you suspect may have been compromised?',
          options: JSON.stringify(['Only annually', 'Every 5 years', 'Immediately', 'Never, passwords don\'t need changing']),
          answer: 2,
          explanation: 'If you suspect a password is compromised, change it immediately. Waiting gives attackers more time to access your accounts.',
        },
        {
          question: 'Which of the following is NOT a good password practice?',
          options: JSON.stringify(['Using a passphrase with mixed characters', 'Sharing your password with a trusted friend for safekeeping', 'Enabling 2FA on all important accounts', 'Using a different password for each site']),
          answer: 1,
          explanation: 'You should never share your password with anyone, even trusted friends. Legitimate services will never need your password.',
        },
        {
          question: 'A hacker obtained 10 million email/password combinations from a data breach. They then try these combinations on other websites. This is called:',
          options: JSON.stringify(['Brute force attack', 'Credential stuffing', 'Social engineering', 'Phishing']),
          answer: 1,
          explanation: 'Credential stuffing uses leaked username/password pairs to try to access accounts on other services, exploiting password reuse.',
        },
        {
          question: 'What is the minimum recommended length for a secure password?',
          options: JSON.stringify(['6 characters', '8 characters', '12 characters', '4 characters']),
          answer: 2,
          explanation: 'Security experts recommend at least 12 characters for good security. Longer is better — each additional character exponentially increases the time to crack.',
        },
        {
          question: 'You forgot your email password. The password reset option asks for your mother\'s maiden name. Why could this be a security risk?',
          options: JSON.stringify(['It\'s not a risk at all', 'Security questions can often be guessed from social media', 'It takes too long', 'It costs money']),
          answer: 1,
          explanation: 'Information like mother\'s maiden name is often publicly available or easily guessable from social media profiles, making security questions weak protection.',
        },
        {
          question: 'Which of these websites can you use to check if your email has been in a known data breach?',
          options: JSON.stringify(['google.com', 'haveibeenpwned.com', 'facebook.com', 'wikipedia.org']),
          answer: 1,
          explanation: 'HaveIBeenPwned.com is a legitimate free service that tells you if your email appears in known data breaches, helping you know when to change compromised passwords.',
        },
      ],
    },
    {
      moduleId: 'module-03',
      questions: [
        {
          question: 'A stranger calls you claiming to be from the NUM IT helpdesk and asks for your student portal password to "fix an issue". You should:',
          options: JSON.stringify(['Give them the password since they sound official', 'Hang up and call the official NUM IT department number from the website', 'Give them only the first few characters', 'Ask them to email you instead']),
          answer: 1,
          explanation: 'This is a classic pretexting attack. No legitimate IT department needs your password. Always verify by calling official numbers independently.',
        },
        {
          question: 'What is "pretexting" in social engineering?',
          options: JSON.stringify(['Sending emails before calling someone', 'Creating a fabricated scenario to manipulate someone into sharing information', 'Using technical hacking tools', 'Sending text messages']),
          answer: 1,
          explanation: 'Pretexting involves creating a believable false identity or scenario (e.g., "I\'m from IT support") to gain someone\'s trust and extract sensitive information.',
        },
        {
          question: 'A classmate tells you they need your student portal login to check their own results because their computer is broken. You should:',
          options: JSON.stringify(['Share your credentials since they\'re a friend', 'Help them access the library computer instead', 'Give them your password temporarily', 'Share your screen with them']),
          answer: 1,
          explanation: 'Never share your credentials, even with friends. Help them find an alternative — library computers, their phone, or contacting IT support.',
        },
        {
          question: 'Which psychological principle do social engineers exploit MOST often?',
          options: JSON.stringify(['Happiness', 'Curiosity and authority', 'Athletic ability', 'Mathematical skill']),
          answer: 1,
          explanation: 'Social engineers exploit human psychology — particularly our tendency to obey authority figures and our natural curiosity — to manipulate victims into unsafe actions.',
        },
        {
          question: 'An Instagram account claiming to be "NUM Official Scholarships" DMs you promising a scholarship if you pay a processing fee. This is:',
          options: JSON.stringify(['A legitimate university service', 'A likely advance-fee fraud (419 scam)', 'A government initiative', 'A student union program']),
          answer: 1,
          explanation: 'Advance-fee fraud (also called 419 scam) tricks victims into paying fees upfront for a reward that never comes. Official scholarships never require upfront payment.',
        },
        {
          question: 'Baiting in cybersecurity refers to:',
          options: JSON.stringify(['Fishing for fish', 'Enticing victims with something attractive to get them to take a harmful action', 'Creating strong passwords', 'Monitoring network traffic']),
          answer: 1,
          explanation: 'Baiting uses tempting offers (free software, free credits, prize winnings) to lure victims into clicking malicious links or downloading malware.',
        },
        {
          question: 'You find a USB drive on campus with a label "NUM Exam Scores 2024". What should you do?',
          options: JSON.stringify(['Plug it into your laptop to check what\'s on it', 'Take it to IT security or administration', 'Leave it where you found it', 'Give it to a friend']),
          answer: 1,
          explanation: 'Unknown USB drives are a classic baiting attack. They may contain malware that auto-executes when plugged in. Take it to IT security who can safely handle it.',
        },
        {
          question: 'How can you verify if a phone call is genuinely from NUM administration?',
          options: JSON.stringify(['Trust the caller ID completely', 'Hang up and call back using the official number from the NUM website', 'Ask them to prove it over the phone', 'Ask for their employee ID']),
          answer: 1,
          explanation: 'Phone spoofing can fake caller IDs. Always hang up and call back using official numbers you independently verify from the institution\'s official website.',
        },
        {
          question: '"Quid pro quo" social engineering involves:',
          options: JSON.stringify(['Hacking into systems', 'Offering a service or benefit in exchange for information', 'Using malware', 'Sending spam emails']),
          answer: 1,
          explanation: 'Quid pro quo attacks offer something (IT help, free software, prizes) in exchange for information or access. "I\'ll fix your computer if you give me your login details."',
        },
        {
          question: 'What is the BEST defense against social engineering attacks?',
          options: JSON.stringify(['Having the most expensive antivirus', 'Continuous education and healthy skepticism', 'Never using the internet', 'Only using private computers']),
          answer: 1,
          explanation: 'Awareness and skepticism are the strongest defenses. Social engineering exploits trust and human psychology, so understanding the tactics helps you resist them.',
        },
      ],
    },
    {
      moduleId: 'module-04',
      questions: [
        {
          question: 'NUM\'s exam portal experienced downtime during exams because hackers locked school data demanding ransom. What type of attack is this?',
          options: JSON.stringify(['Phishing attack', 'Ransomware attack', 'Social engineering', 'Password attack']),
          answer: 1,
          explanation: 'Ransomware encrypts data and demands payment for decryption keys. This exactly describes the incident where NUM\'s data was locked by hackers demanding ransom.',
        },
        {
          question: 'How does ransomware typically first get onto a computer?',
          options: JSON.stringify(['Through physical theft of the computer', 'Through malicious email attachments or compromised downloads', 'Through the power supply', 'Through the screen']),
          answer: 1,
          explanation: 'Most ransomware enters systems through phishing emails with malicious attachments, infected downloads, or vulnerabilities in unpatched software.',
        },
        {
          question: 'If your device gets infected with ransomware, what is the FIRST thing you should do?',
          options: JSON.stringify(['Pay the ransom immediately', 'Disconnect from the internet and network immediately', 'Restart your computer multiple times', 'Delete all your files']),
          answer: 1,
          explanation: 'Immediate disconnection from the network prevents the ransomware from spreading to other devices and potentially stops the encryption process.',
        },
        {
          question: 'What is the 3-2-1 backup rule?',
          options: JSON.stringify(['Back up 3 times per day', '3 copies of data, on 2 different media, with 1 stored offsite', 'Use 3 different passwords for backups', '3 backup drives, 2 clouds, 1 email']),
          answer: 1,
          explanation: 'The 3-2-1 rule: keep 3 copies of your data, on 2 different storage types (e.g., laptop + external drive), with 1 copy stored offsite or in the cloud.',
        },
        {
          question: 'Should you pay the ransom if your data is encrypted by ransomware?',
          options: JSON.stringify(['Yes, always pay immediately', 'No, payment doesn\'t guarantee data recovery and funds criminal activity', 'Only if you really need the data', 'Only pay half the amount']),
          answer: 1,
          explanation: 'Paying ransom is strongly discouraged: it funds criminals, doesn\'t guarantee data return, and may invite further attacks. Report to law enforcement instead.',
        },
        {
          question: 'What is a trojan horse in cybersecurity?',
          options: JSON.stringify(['An ancient Greek story', 'Malware disguised as legitimate software', 'A type of firewall', 'A network protocol']),
          answer: 1,
          explanation: 'Like the mythological Trojan Horse, trojans disguise themselves as useful software to trick users into installing them, then perform malicious actions.',
        },
        {
          question: 'Which of the following is NOT a recommended way to protect against malware?',
          options: JSON.stringify(['Installing antivirus software', 'Keeping your OS updated', 'Downloading pirated movies and software', 'Avoiding suspicious email attachments']),
          answer: 2,
          explanation: 'Downloading pirated content is a major vector for malware. Pirated software often contains hidden malware, including ransomware and keyloggers.',
        },
        {
          question: 'Spyware is dangerous because it:',
          options: JSON.stringify(['Makes your computer faster', 'Secretly monitors your activities and sends data to attackers', 'Blocks all internet access', 'Protects your data']),
          answer: 1,
          explanation: 'Spyware silently records your keystrokes, captures screenshots, and monitors your browsing, sending this information to attackers without your knowledge.',
        },
        {
          question: 'Why is it important to keep your operating system updated?',
          options: JSON.stringify(['Updates add new wallpapers', 'Updates patch security vulnerabilities that malware exploits', 'Updates make apps load slower', 'Updates are not important']),
          answer: 1,
          explanation: 'Software updates frequently contain critical security patches that fix vulnerabilities. Unpatched systems are easy targets for malware and ransomware attacks.',
        },
        {
          question: 'A legitimate antivirus program would:',
          options: JSON.stringify(['Ask you to pay before scanning', 'Run in background, scan for threats, and provide regular updates', 'Delete all your files as a precaution', 'Slow down your computer significantly']),
          answer: 1,
          explanation: 'Genuine antivirus software silently protects in the background, provides regular virus definition updates, and removes threats without deleting legitimate files.',
        },
      ],
    },
    {
      moduleId: 'module-05',
      questions: [
        {
          question: 'You are using campus WiFi to check your bank account. A hacker is monitoring the network. What is this called?',
          options: JSON.stringify(['A DDoS attack', 'A Man-in-the-Middle (MITM) attack', 'A ransomware attack', 'A phishing attack']),
          answer: 1,
          explanation: 'Man-in-the-Middle attacks intercept communications between two parties on unsecured networks. Using public WiFi for banking exposes you to this risk.',
        },
        {
          question: 'A VPN (Virtual Private Network) protects you by:',
          options: JSON.stringify(['Making you anonymous and untraceable forever', 'Encrypting your internet traffic, protecting it from interception', 'Speeding up your internet connection', 'Blocking all advertisements']),
          answer: 1,
          explanation: 'A VPN encrypts the data traveling between your device and the internet, making it unreadable to anyone intercepting it on a public network.',
        },
        {
          question: 'Which of the following is the safest browser behavior?',
          options: JSON.stringify(['Saving all passwords in the browser on shared computers', 'Always checking for HTTPS before entering personal data', 'Clicking on pop-up ads that offer prizes', 'Ignoring browser security warnings']),
          answer: 1,
          explanation: 'HTTPS (the padlock icon) indicates an encrypted connection. Always verify it before entering passwords, payment details, or personal information.',
        },
        {
          question: 'What does it mean when a website shows a padlock icon (🔒) in the browser address bar?',
          options: JSON.stringify(['The website is 100% safe and trustworthy', 'The connection between your browser and the website is encrypted', 'The website requires a password to enter', 'The website is offline']),
          answer: 1,
          explanation: 'HTTPS/padlock means the connection is encrypted, protecting data in transit. However, it does NOT mean the website itself is legitimate or safe.',
        },
        {
          question: 'Why should you avoid using public computers (library, cybercafe) for sensitive tasks?',
          options: JSON.stringify(['They are always broken', 'They may have keyloggers or malware installed that steal your data', 'They don\'t have internet', 'They are too expensive']),
          answer: 1,
          explanation: 'Public computers may have keyloggers (software that records everything you type) or malware installed, which can capture your passwords and sensitive information.',
        },
        {
          question: 'You receive a notification that an app wants to access your contacts, camera, microphone, AND location. The app is a simple calculator. You should:',
          options: JSON.stringify(['Grant all permissions since it helps the app work better', 'Deny unnecessary permissions — a calculator doesn\'t need these', 'Uninstall your phone', 'Ignore the notification']),
          answer: 1,
          explanation: 'Excessive permissions are a red flag for malicious apps. A calculator only needs basic computational access. Granting unnecessary permissions risks your privacy.',
        },
        {
          question: 'What is the safest way to log out of your student portal on a shared computer?',
          options: JSON.stringify(['Just close the browser tab', 'Click "Log Out" and then close the browser', 'Leave it open for other students to see your grades', 'Restart the computer']),
          answer: 1,
          explanation: 'Clicking "Log Out" ends your session server-side and clears your authentication token. Simply closing the tab may leave your session active.',
        },
        {
          question: 'When creating a social media profile for professional purposes, you should:',
          options: JSON.stringify(['Share your home address and phone number openly', 'Keep personal information minimal and review privacy settings', 'Accept all friend requests to build connections', 'Share your daily schedule publicly']),
          answer: 1,
          explanation: 'Oversharing personal details on social media can enable identity theft, social engineering, and physical security risks. Minimal disclosure protects you.',
        },
        {
          question: 'What is a firewall?',
          options: JSON.stringify(['A physical wall that prevents fire', 'Security software/hardware that monitors and controls incoming/outgoing network traffic', 'A type of antivirus', 'An email spam filter']),
          answer: 1,
          explanation: 'A firewall acts as a security barrier between your device/network and the internet, filtering traffic based on security rules to block unauthorized access.',
        },
        {
          question: 'The best long-term strategy for cybersecurity is:',
          options: JSON.stringify(['Buying the most expensive security tools', 'Continuous learning and practicing good digital hygiene daily', 'Avoiding using the internet completely', 'Relying on your institution\'s IT team for everything']),
          answer: 1,
          explanation: 'Cybersecurity is an ongoing practice, not a one-time fix. Continuous learning, updated habits, and daily awareness keep you protected as threats evolve.',
        },
      ],
    },
  ];

  for (const moduleQuiz of quizData) {
    for (let i = 0; i < moduleQuiz.questions.length; i++) {
      await prisma.quizQuestion.create({
        data: {
          moduleId: moduleQuiz.moduleId,
          ...moduleQuiz.questions[i],
          order: i + 1,
        },
      });
    }
    console.log(`✅ Quiz questions created for ${moduleQuiz.moduleId}`);
  }

  // Create Scenarios
  const scenarios = [
    {
      id: 'scenario-01',
      title: 'The Fake Admissions Officer',
      description: 'You are a prospective NUM student. Navigate a suspicious situation involving someone claiming to offer you an admission slot.',
      incident: 'A student was defrauded by a fake admissions officer through phone calls and social media.',
      thumbnail: '📱',
      difficulty: 'Medium',
      xpReward: 150,
      steps: JSON.stringify([
        {
          id: 1,
          text: 'You posted on a NUM Facebook group asking about admission requirements. Minutes later, you receive a DM from an account called "NUM Admissions Help" with a profile picture of a man in a suit. The message reads: "Hello! I am Mr. David from NUM Admissions Office. I saw your post and can guarantee you admission this session. All you need to do is pay a ₦15,000 processing fee to reserve your slot. Time is limited — only 3 slots left!" What do you do?',
          choices: [
            { text: 'Pay the fee immediately — you don\'t want to miss your slot', points: 0, feedback: '❌ Wrong! This is a scam. Legitimate universities never take payments through social media DMs. You just lost ₦15,000.' },
            { text: 'Ask for their official email address and phone number to verify', points: 50, feedback: '✅ Good instinct! But even official-looking contact details can be faked. Let\'s see what happens next...' },
            { text: 'Ignore and report the account to Facebook and NUM official channels', points: 100, feedback: '🌟 Excellent! This is exactly right. Reporting protects you and others. NUM\'s admissions are only done through official portals.' },
          ],
        },
        {
          id: 2,
          text: 'You ask for verification. "Mr. David" sends you a WhatsApp message with what looks like an official NUM ID card and a stamped letter of authorization. He now says: "The fee is just ₦10,000 since you questioned me — I\'m doing you a favor. Send to this account: 0123456789 (GTBank - David Okafor). Do it now before the deadline." What do you do?',
          choices: [
            { text: 'The documents look real. Pay the reduced fee quickly', points: 0, feedback: '❌ Scammers are skilled at creating fake documents. The urgency and personal account (not NUM official account) are major red flags. This is still a scam.' },
            { text: 'Call the official NUM admissions office using the number on the official website to verify this person', points: 100, feedback: '🌟 Perfect! Always verify through official channels independently. Call the number on NUM\'s official website, not numbers provided by the suspicious contact.' },
            { text: 'Ask to meet in person before paying', points: 40, feedback: '⚠️ Partially good — you\'re skeptical. But scammers can meet in person too. The right move is to verify through official NUM channels first.' },
          ],
        },
        {
          id: 3,
          text: 'You call the official NUM admissions line and they confirm that there is NO "Mr. David" working in admissions and NO social media payment system exists. The WhatsApp account and Facebook profile were completely fake. What do you do now?',
          choices: [
            { text: 'Just ignore it and move on — at least you didn\'t pay', points: 30, feedback: '⚠️ You protected yourself, which is good! But not reporting means other students will fall victim to the same scam.' },
            { text: 'Report the fake accounts to Facebook/WhatsApp AND report to the Nigeria Police Force cybercrime unit (EFCC/NPF)', points: 100, feedback: '🌟 Outstanding! Reporting stops the scammer from victimizing others. The EFCC Cybercrime unit handles these cases at cybercrime@efcc.gov.ng.' },
            { text: 'Post about it on social media to warn others (without reporting officially)', points: 60, feedback: '✅ Good — warning others is important! But also file an official report to help authorities track and stop the criminal.' },
          ],
        },
      ]),
    },
    {
      id: 'scenario-02',
      title: 'The Compromised Account',
      description: 'You receive an email that looks like it is from your student portal. One wrong click could compromise your account.',
      incident: 'Students had their accounts compromised by clicking on phishing links.',
      thumbnail: '🎣',
      difficulty: 'Easy',
      xpReward: 120,
      steps: JSON.stringify([
        {
          id: 1,
          text: 'You receive an email with the subject: "⚠️ URGENT: Your NUM Student Portal Account Will Be Suspended in 24 Hours". The sender email shows: "noreply@numa-studentportal.com". The email contains your name and asks you to click a link to verify your account. The link shows: "http://numa-portal-verify.xyz/login". What do you do?',
          choices: [
            { text: 'Click the link — the email has your name so it must be real', points: 0, feedback: '❌ Dangerous! The sender domain is "numa-studentportal.com" (not the official newgateuniversityminna.edu.ng) and the link goes to a suspicious ".xyz" domain. This is phishing.' },
            { text: 'Check the official NUM website directly by typing it in your browser, then log in from there', points: 100, feedback: '🌟 Perfect approach! Never follow email links to login pages. Always type the official URL directly in your browser.' },
            { text: 'Forward the email to all your classmates to warn them', points: 20, feedback: '⚠️ Warning intent is good but forwarding phishing emails spreads them further. Report to IT and delete it.' },
          ],
        },
        {
          id: 2,
          text: 'Your curiosity gets the better of you and you hover over the link without clicking. The actual URL that appears is: "http://numa-portal-verify.xyz/steal-your-login". You also notice the email contains 3 spelling errors. You now realize this is a phishing email. What\'s your next step?',
          choices: [
            { text: 'Reply to the email telling them you know it\'s a scam', points: 10, feedback: '⚠️ Replying confirms your email is active, which leads to more spam/phishing. Never reply to suspected phishing emails.' },
            { text: 'Delete the email, report it as phishing in your email client, and report to IT support', points: 100, feedback: '🌟 Excellent! Mark as phishing (trains your email filter), report to IT (protects others), and delete. This is the correct response.' },
            { text: 'Click the link now that you know it\'s fake, just to see what it looks like', points: 0, feedback: '❌ Never! Even "just looking" can trigger malware downloads or confirm your email is active for future attacks.' },
          ],
        },
        {
          id: 3,
          text: 'You find out your classmate Emmanuel actually clicked the link and entered his portal credentials on the fake site. His account is now compromised. He comes to you for help. What do you advise him?',
          choices: [
            { text: 'Tell him to wait and see if anything happens', points: 0, feedback: '❌ Waiting is the worst option. Every minute allows the attacker more access to Emmanuel\'s data and potentially others\' data.' },
            { text: 'Advise him to immediately change his portal password, enable 2FA, and report to NUM IT support', points: 100, feedback: '🌟 Perfect! Immediate password change limits damage. Reporting to IT ensures the institution can investigate and protect other students.' },
            { text: 'Help him create a new email account as a replacement', points: 20, feedback: '⚠️ A new email doesn\'t help his compromised portal account. The priority is changing the portal password and reporting to IT.' },
          ],
        },
      ]),
    },
    {
      id: 'scenario-03',
      title: 'The Exam Portal Crisis',
      description: 'The school exam portal goes down during exams. Learn to identify DDoS attacks and respond effectively.',
      incident: 'The school exam portal frequently experiences downtime during examinations.',
      thumbnail: '💻',
      difficulty: 'Hard',
      xpReward: 180,
      steps: JSON.stringify([
        {
          id: 1,
          text: 'It is the first day of your semester examinations. You and 200 other students are logged into the NUM online exam portal. Suddenly, the portal becomes extremely slow, then completely unresponsive. Students start panicking. Your course rep says rumors are spreading that someone deliberately overloaded the server. As a student, what is the MOST productive first action?',
          choices: [
            { text: 'Continuously refresh the page hoping it comes back', points: 20, feedback: '⚠️ Constant refreshing actually WORSENS a DDoS attack by adding more traffic to an overwhelmed server.' },
            { text: 'Calmly stay seated, stop refreshing, and wait for official communication from the exam coordinator', points: 100, feedback: '✅ Correct. Panicking and mass-refreshing worsens the outage. Stopping unnecessary traffic and waiting for official guidance is the right call.' },
            { text: 'Leave the exam hall immediately', points: 0, feedback: '❌ Leaving without authorization during an exam could have academic consequences. Wait for official instructions.' },
          ],
        },
        {
          id: 2,
          text: 'IT confirms the portal was hit by a DDoS (Distributed Denial of Service) attack — hackers flooded the server with millions of fake requests. The exam has been postponed by 2 hours. A fellow student shows you a Telegram group where someone is sharing "tools to help" get the portal back up, asking students to install a program. What do you do?',
          choices: [
            { text: 'Install the tool — if it helps restore the portal, it\'s worth it', points: 0, feedback: '❌ This is almost certainly a social engineering attack exploiting the crisis. Installing unknown programs during an incident is extremely dangerous.' },
            { text: 'Ignore it, report the Telegram group to university IT security, and warn your classmates', points: 100, feedback: '🌟 Excellent! Attackers exploit crisis situations to spread malware. Reporting and warning others is the right response.' },
            { text: 'Join the group to monitor what\'s happening but don\'t install anything', points: 40, feedback: '⚠️ Being cautious is good, but the safest action is to avoid the group entirely and report it to IT security.' },
          ],
        },
        {
          id: 3,
          text: 'After the incident, the school wants students to help improve cybersecurity. You are invited to a meeting. What recommendations would be most effective to prevent future exam portal attacks?',
          choices: [
            { text: 'The school should stop all online exams and return to paper-based testing', points: 20, feedback: '⚠️ While understandable, completely abandoning digital systems is not a forward-looking solution. Technical improvements can secure the portal effectively.' },
            { text: 'Recommend DDoS protection services, load balancing, scheduled exams in batches, and an offline backup exam plan', points: 100, feedback: '🌟 Outstanding technical thinking! These are the actual solutions used by universities worldwide. DDoS protection services and redundancy prevent these attacks.' },
            { text: 'Recommend blocking all student access to the internet during exams', points: 30, feedback: '⚠️ This doesn\'t address external DDoS attacks and would break online exam functionality. Server-side protections are more effective.' },
          ],
        },
      ]),
    },
    {
      id: 'scenario-04',
      title: 'Ransomware at NUM',
      description: 'The university\'s data system has been encrypted by ransomware. Navigate the crisis and learn prevention strategies.',
      incident: 'The school\'s data was locked by hackers demanding ransom.',
      thumbnail: '🔒',
      difficulty: 'Hard',
      xpReward: 200,
      steps: JSON.stringify([
        {
          id: 1,
          text: 'You are a student worker in the NUM IT department. On Monday morning, you arrive to find a message on every computer screen: "YOUR FILES HAVE BEEN ENCRYPTED. Pay ₦50 million in Bitcoin within 72 hours or all data will be permanently deleted. Contact: ransom@darkweb.onion". All university databases — student records, exam results, staff data — are inaccessible. What should be the immediate response?',
          choices: [
            { text: 'Pay the ransom immediately to restore access as fast as possible', points: 0, feedback: '❌ Paying ransom is strongly discouraged. It funds criminal operations, doesn\'t guarantee data recovery, and signals the university is willing to pay — inviting future attacks.' },
            { text: 'Immediately disconnect all affected systems from the network, notify IT leadership and management', points: 100, feedback: '🌟 Correct! Immediate isolation prevents the ransomware from spreading to other systems. Notifying leadership starts the incident response process.' },
            { text: 'Start deleting files to prevent further encryption', points: 0, feedback: '❌ Deleting files destroys evidence and may remove unencrypted data. Isolation and expert response are the right steps, not self-remediation.' },
          ],
        },
        {
          id: 2,
          text: 'IT has isolated the affected systems. The ransomware came from an email attachment opened by a staff member 3 days ago. Investigators want to trace the infection path. As the student IT worker, you discover that the staff member\'s computer had NOT been updated in 14 months. The ransomware exploited a known vulnerability that was patched 10 months ago. What does this teach us?',
          choices: [
            { text: 'Staff members are always the cause of cyberattacks and should not use computers', points: 0, feedback: '❌ Blaming individuals without systemic solutions doesn\'t prevent future attacks. The system failed to enforce updates, which is an institutional issue.' },
            { text: 'Regular software updates and automated patch management could have prevented this specific attack', points: 100, feedback: '🌟 Exactly right. This exploit had a known patch available for 10 months. A proper patch management policy would have prevented this breach entirely.' },
            { text: 'The university should buy more expensive hardware', points: 10, feedback: '⚠️ Hardware upgrades don\'t address software vulnerabilities. Security patching and policy enforcement are the key lessons here.' },
          ],
        },
        {
          id: 3,
          text: 'IT discovers they do have backups — but the last backup was made 3 months ago. Some recent exam results and research data may be lost. Moving forward, the IT director asks for your recommendation to prevent this from happening again. What is the BEST comprehensive recommendation?',
          choices: [
            { text: 'Just buy a more powerful server', points: 10, feedback: '⚠️ A better server doesn\'t prevent ransomware. The solution requires layered security practices, not just hardware.' },
            { text: 'Implement: regular backups (daily/weekly), email filtering for attachments, mandatory cybersecurity training for all staff, automated patch management, and endpoint detection software', points: 100, feedback: '🌟 Outstanding! This is exactly the layered security approach recommended by cybersecurity experts. Multiple defenses reduce the chance any single attack succeeds.' },
            { text: 'Make all student and staff data public so there is nothing to hold ransom', points: 0, feedback: '❌ Making personal data public would violate privacy laws and cause enormous harm to students and staff. This is not a solution.' },
          ],
        },
      ]),
    },
  ];

  for (const scenario of scenarios) {
    await prisma.scenario.upsert({
      where: { id: scenario.id },
      update: {},
      create: scenario,
    });
    console.log(`✅ Scenario created: ${scenario.title}`);
  }

  // Create Badges
  const badges = [
    { id: 'badge-01', name: 'First Steps', description: 'Completed your first learning module', icon: '🎯', condition: 'Complete 1 module', moduleCount: 1 },
    { id: 'badge-02', name: 'Knowledge Seeker', description: 'Completed 3 learning modules', icon: '📚', condition: 'Complete 3 modules', moduleCount: 3 },
    { id: 'badge-03', name: 'CyberShield Graduate', description: 'Completed all 5 learning modules', icon: '🛡️', condition: 'Complete all 5 modules', moduleCount: 5 },
    { id: 'badge-04', name: 'Quiz Master', description: 'Scored 100% on any quiz', icon: '🏆', condition: 'Get perfect score on a quiz', xpThreshold: null },
    { id: 'badge-05', name: 'Scenario Survivor', description: 'Completed your first scenario simulation', icon: '🎭', condition: 'Complete 1 scenario', moduleCount: null },
    { id: 'badge-06', name: 'Rising Star', description: 'Earned 500 XP points', icon: '⭐', condition: 'Earn 500 XP', xpThreshold: 500 },
    { id: 'badge-07', name: 'Cyber Guardian', description: 'Earned 1000 XP points', icon: '⚡', condition: 'Earn 1000 XP', xpThreshold: 1000 },
    { id: 'badge-08', name: 'Cyber Legend', description: 'Earned 2500 XP points', icon: '👑', condition: 'Earn 2500 XP', xpThreshold: 2500 },
    { id: 'badge-09', name: 'Phishing Hunter', description: 'Completed the Phishing Awareness module', icon: '🎣', condition: 'Complete Phishing module', moduleCount: null },
    { id: 'badge-10', name: 'Streak Fighter', description: 'Logged in 7 days in a row', icon: '🔥', condition: '7-day login streak', moduleCount: null },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { id: badge.id },
      update: {},
      create: badge,
    });
  }
  console.log('✅ All badges created');

  console.log('\n🎉 Database seeded successfully!');
  console.log('📧 Admin Password: Admin@NUM2025');
  console.log('📧 Admin Email: admin@newgateuniversityminna.edu.ng');
  console.log('🔑 Admin Password: Admin@NUM2025');
  console.log('📧 Demo Student Email: demo@student.newgateuniversityminna.edu.ng');
  console.log('🔑 Demo Student Password: Student@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
