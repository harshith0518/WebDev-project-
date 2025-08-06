
const paths = {
  LANDINGPAGE: '/',
  LOGIN: '/login',
  HOME: '/',
  REGISTER: '/register',
  LOGOUT: '/logout',
  PROBLEMS: '/problems',
  PROFILE: '/profile/:id',
  CODEIDE: '/code-ide',
  LEADERBOARD:'/leaderboard',
  CONTESTS:'/contests',
  EDITPROFILE: 'profile/:id/edit',
  SOLUTIONS:'/solutions',
  ADDPROBLEM: '/problems/add-problem',
  PROBLEMSETS: '/problem-sets',
  ADDPROBLEMSETS: '/problem-sets/add-set',
  BASE : String(import.meta.env.VITE_API_BASE_URL)
};

export default paths;