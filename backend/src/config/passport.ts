import 'dotenv/config';
import passport from 'passport';
import passportGoogle from 'passport-google-oauth2';
import User from '../database/models/User';
const GoogleStrategy = passportGoogle.Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/auth/google/redirect`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const user = await User.findOne({ where: { id: profile.id } });

      const userId = profile.id;
      const userEmail = profile.emails?.[0].value;
      const userName = profile.displayName;
      const userProfilePictureUrl = profile.picture;

      if (!user) {
        const newUser = await User.create({
          id: userId,
          email: userEmail,
          name: userName,
          profilePictureUrl: userProfilePictureUrl,
        });
        if (newUser) {
          done(null, newUser);
        }
      } else {
        if (
          user.email !== userEmail ||
          user.name !== userName ||
          user.profilePictureUrl !== userProfilePictureUrl
        ) {
          await User.update(
            {
              email: userEmail,
              name: userName,
              profilePictureUrl: userProfilePictureUrl,
            },
            { where: { id: user.id } },
          );
        }
        done(null, user);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findOne({ where: { id } });
  done(null, user);
});
