import { useState } from 'react';
import './App.css';

const API = 'http://localhost:8080/api';

const courses = [
  {
    name: 'Java Programming',
    description: 'Learn Java from basics.',
    duration: '6 weeks',
    topics: 'Variables, loops, arrays, classes and objects',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg'
  },
  {
    name: 'React JS',
    description: 'Learn to build web applications.',
    duration: '4 weeks',
    topics: 'Components, props, state and hooks',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
  },
  {
    name: 'Python Programming',
    description: 'Learn Python step by step.',
    duration: '5 weeks',
    topics: 'Variables, loops, functions and lists',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'
  }
];

const styles = {
  app: {
    minHeight: '100vh',
    background: '#f3f5f8',
    color: '#243447',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    background: '#7040A0',
    color: 'white',
    minHeight: '78px',
    padding: '0 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px'
  },
  logo: {
    fontSize: '30px',
    fontWeight: 'bold',
    cursor: 'pointer',
    margin: '12px 0'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  navButton: {
    background: 'transparent',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.45)',
    borderRadius: '4px',
    padding: '9px 13px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  main: {
    padding: '20px',
    maxWidth: '1500px',
    margin: '0 auto'
  },
  hero: {
    minHeight: '250px',
    borderRadius: '7px',
    overflow: 'hidden',
    backgroundImage:
      'linear-gradient(90deg, rgba(0,0,0,0.62), rgba(0,0,0,0.08)), url("https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=85")',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    display: 'flex',
    alignItems: 'center',
    color: 'white'
  },
  heroContent: {
    padding: '35px 7%',
    maxWidth: '600px'
  },
  heroTitle: {
    fontSize: '30px',
    marginBottom: '15px'
  },
  heading: {
    fontSize: '23px',
    margin: '25px 0 18px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '18px',
    marginBottom: '25px'
  },
  card: {
    background: 'white',
    border: '1px solid #d9dce1',
    borderRadius: '7px',
    padding: '20px',
    boxSizing: 'border-box'
  },
  cardTitle: {
    fontSize: '18px',
    marginTop: '16px',
    marginBottom: '12px',
    color: '#172b40'
  },
  button: {
    background: '#7040A0',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 15px',
    cursor: 'pointer',
    margin: '5px 7px 5px 0',
    fontSize: '14px'
  },
  secondaryButton: {
    background: '#e6ebf0',
    color: '#7040A0',
    border: '1px solid #ccd5df',
    borderRadius: '4px',
    padding: '10px 15px',
    cursor: 'pointer',
    margin: '5px 7px 5px 0',
    fontSize: '14px'
  },
  form: {
    background: 'white',
    border: '1px solid #d9dce1',
    borderRadius: '7px',
    padding: '25px',
    maxWidth: '460px',
    margin: '25px auto'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ccd2d9',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '15px'
  },
  message: {
    padding: '12px 15px',
    background: 'white',
    border: '1px solid #d9dce1',
    borderRadius: '5px',
    marginBottom: '18px',
    overflowWrap: 'anywhere'
  }
};

function App() {
  const [page, setPage] = useState('home');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function navigate(newPage) {
    setMessage('');
    setPage(newPage);
  }

  function openCourse(course) {
    setSelectedCourse(course);
    setMessage('');
    setPage('details');
  }

  async function loadEnrollments(email) {
    const response = await fetch(
      `${API}/enrollments?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();
    setEnrollments(Array.isArray(data) ? data : []);
  }

  async function handleRegister(event) {
    event.preventDefault();

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.get('fullName'),
          email: form.get('email'),
          password: form.get('password')
        })
      });

      const result = await response.text();

      if (!response.ok) {
        setMessage(result);
        return;
      }

      formElement.reset();
      setMessage(result + '. Please log in.');
    } catch (error) {
      setMessage('Could not connect to the backend. Check Terminal 3.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const email = form.get('email');

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: form.get('password')
        })
      });

      const result = await response.text();

      if (!response.ok) {
        setMessage(result);
        return;
      }

      const profileResponse = await fetch(
        `${API}/users/profile?email=${encodeURIComponent(email)}`
      );

      if (!profileResponse.ok) {
        throw new Error('Could not load your profile. Check UserController.');
      }

      const profile = await profileResponse.json();

      setCurrentUser(profile);
      setEnrollments([]);
      formElement.reset();
      setPage('dashboard');

      try {
        await loadEnrollments(profile.email);
        setMessage('');
      } catch (error) {
        setMessage(
          'Login successful, but enrolled courses could not load. ' +
          'Check EnrollmentController and the backend.'
        );
      }
    } catch (error) {
      setMessage('Login error: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEnrollment(event) {
    event.preventDefault();

    if (!currentUser || !selectedCourse) {
      setMessage('Please log in before enrolling.');
      setPage('login');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          courseName: selectedCourse.name
        })
      });

      const result = await response.text();

      if (!response.ok) {
        setMessage(result);
        return;
      }

      setPage('dashboard');
      setSelectedCourse(null);
      setMessage(result);

      try {
        await loadEnrollments(currentUser.email);
      } catch (error) {
        setMessage(
          result + ', but the dashboard could not refresh its course list.'
        );
      }
    } catch (error) {
      setMessage('Enrollment failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setCurrentUser(null);
    setEnrollments([]);
    setSelectedCourse(null);
    setMessage('');
    setPage('home');
  }

  function startEnrollment() {
    if (!currentUser) {
      setMessage('Please log in first to enroll in a course.');
      setPage('login');
      return;
    }

    if (enrollments.some(
      item => item.courseName === selectedCourse?.name
    )) {
      setMessage('You are already enrolled in this course.');
      return;
    }

    setMessage('');
    setPage('enroll');
  }

  return (
    <div className="App" style={styles.app}>
      <header style={styles.header}>
        <div
          style={styles.logo}
          onClick={() => navigate('home')}
        >
          EduVibe
        </div>

        <nav style={styles.nav}>
          <button
            style={styles.navButton}
            onClick={() => navigate('home')}
          >
            Home
          </button>

          <button
            style={styles.navButton}
            onClick={() => navigate('courses')}
          >
            Courses
          </button>

          {currentUser ? (
            <>
              <button
                style={styles.navButton}
                onClick={() => navigate('dashboard')}
              >
                Dashboard
              </button>

              <button
                style={styles.navButton}
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                style={styles.navButton}
                onClick={() => navigate('login')}
              >
                Login
              </button>

              <button
                style={styles.navButton}
                onClick={() => navigate('register')}
              >
                Register
              </button>
            </>
          )}
        </nav>
      </header>

      <main style={styles.main}>
        {message && (
          <div role="status" style={styles.message}>
            {message}
          </div>
        )}

        {(page === 'home' || page === 'courses') && (
          <>
            {page === 'home' && (
              <div className="hero-row">
                <section style={styles.hero}>
                  <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>
                      Learn Something New Every Day
                    </h1>
                    <p>Explore courses and improve your skills.</p>
                  </div>
                </section>

                <div className="team-members">
                  <p>Amreen<br />24251A0567</p>
                  <p>Avni<br />24251A0568</p>
                  <p>G Sai Akshaya<br />24251A05B1</p>
                </div>
              </div>
            )}

            <h2 style={styles.heading}>Available Courses</h2>

            <div style={styles.grid}>
              {courses.map(course => (
                <article
                  key={course.name}
                  style={styles.card}
                >
                  <img
                    src={course.image}
                    alt={course.name}
                    className="course-logo"
                  />

                  <h3 style={styles.cardTitle}>{course.name}</h3>
                  <p>{course.description}</p>

                  <button
                    style={styles.button}
                    onClick={() => openCourse(course)}
                  >
                    View Course
                  </button>
                </article>
              ))}
            </div>
          </>
        )}

        {page === 'details' && selectedCourse && (
          <section style={styles.card}>
            <h2>{selectedCourse.name}</h2>
            <p>{selectedCourse.description}</p>

            <p>
              <strong>Duration:</strong> {selectedCourse.duration}
            </p>

            <p>
              <strong>Topics:</strong> {selectedCourse.topics}
            </p>

            {currentUser && enrollments.some(
              item => item.courseName === selectedCourse.name
            ) ? (
              <p>You are already enrolled in this course.</p>
            ) : (
              <button
                style={styles.button}
                onClick={startEnrollment}
              >
                Enroll Now
              </button>
            )}

            <button
              style={styles.secondaryButton}
              onClick={() => navigate('courses')}
            >
              Back to Courses
            </button>
          </section>
        )}

        {page === 'register' && (
          <section style={styles.form}>
            <h2>Create Account</h2>

            <form onSubmit={handleRegister}>
              <input
                style={styles.input}
                name="fullName"
                placeholder="Full Name"
                required
              />

              <input
                style={styles.input}
                name="email"
                type="email"
                placeholder="Email"
                required
              />

              <input
                style={styles.input}
                name="password"
                type="password"
                placeholder="Password"
                required
              />

              <button
                style={styles.button}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Please wait...' : 'Register'}
              </button>
            </form>

            <p>
              Already registered?{' '}
              <button
                style={styles.secondaryButton}
                onClick={() => navigate('login')}
              >
                Login
              </button>
            </p>
          </section>
        )}

        {page === 'login' && (
          <section style={styles.form}>
            <h2>Student Login</h2>

            <form onSubmit={handleLogin}>
              <input
                style={styles.input}
                name="email"
                type="email"
                placeholder="Email"
                required
              />

              <input
                style={styles.input}
                name="password"
                type="password"
                placeholder="Password"
                required
              />

              <button
                style={styles.button}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Please wait...' : 'Login'}
              </button>
            </form>
          </section>
        )}

        {page === 'enroll' && currentUser && selectedCourse && (
          <section style={styles.form}>
            <h2>Confirm Enrollment</h2>

            <p>
              <strong>Student:</strong> {currentUser.fullName}
            </p>

            <p>
              <strong>Email:</strong> {currentUser.email}
            </p>

            <p>
              <strong>Course:</strong> {selectedCourse.name}
            </p>

            <p>
              <strong>Duration:</strong> {selectedCourse.duration}
            </p>

            <form onSubmit={handleEnrollment}>
              <button
                style={styles.button}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Enrolling...' : 'Confirm Enrollment'}
              </button>
            </form>

            <button
              style={styles.secondaryButton}
              onClick={() => navigate('details')}
            >
              Back
            </button>
          </section>
        )}

        {page === 'dashboard' && currentUser && (
          <section>
            <div style={styles.card}>
              <h1>Student Dashboard</h1>
              <h2>Welcome, {currentUser.fullName}!</h2>
              <p>{currentUser.email}</p>

              <p>
                <strong>My Enrolled Courses:</strong>{' '}
                {enrollments.length}
              </p>
            </div>

            <h2 style={styles.heading}>My Learning</h2>

            {enrollments.length === 0 ? (
              <section style={styles.card}>
                <p>You have not enrolled in any courses yet.</p>

                <button
                  style={styles.button}
                  onClick={() => navigate('courses')}
                >
                  Explore Courses
                </button>
              </section>
            ) : (
              <div style={styles.grid}>
                {enrollments.map(item => (
                  <article
                    style={styles.card}
                    key={item.id}
                  >
                    <h3 style={styles.cardTitle}>
                      {item.courseName}
                    </h3>

                    <p>Enrollment successful!</p>

                    <p>
                      Enrolled on:{' '}
                      {item.enrolledAt
                        ? new Date(item.enrolledAt).toLocaleDateString()
                        : 'Recently'}
                    </p>
                  </article>
                ))}
              </div>
            )}

            <button
              style={styles.button}
              onClick={() => navigate('courses')}
            >
              Explore More Courses
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;