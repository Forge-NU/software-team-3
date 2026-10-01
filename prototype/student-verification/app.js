import {
  createClient
} from "https://esm.sh/@supabase/supabase-js@2";


const supabaseUrl =
  "https://nmshyrlbhvhreoejdrti.supabase.co";

const supabasePublishableKey =
  "sb_publishable_SVBIvc6xqBmXSGw-4eaRlA_n6HiIt16";


const supabase =
  createClient(
    supabaseUrl,
    supabasePublishableKey
  );


const views = [
  "signup-view",
  "login-view",
  "confirmation-view",
  "verification-view",
  "complete-view"
];


function showView(id) {

  for (const viewId of views) {

    document
      .getElementById(viewId)
      .classList
      .add("hidden");

  }


  document
    .getElementById(id)
    .classList
    .remove("hidden");

}


function isNortheasternEmail(email) {

  return /^[^@\s]+@northeastern\.edu$/i
    .test(email);

}


function validUsername(username) {

  return /^[a-z0-9_]{3,24}$/i
    .test(username);

}


function validPassword(password) {

  return (
    password.length >= 8
    &&
    /[A-Z]/.test(password)
    &&
    /[a-z]/.test(password)
    &&
    /[0-9]/.test(password)
  );

}


function setButtonLoading(
  button,
  loading,
  normalText,
  loadingText
) {

  button.disabled = loading;

  button.textContent =
    loading
      ? loadingText
      : normalText;

}


async function checkUsername(username) {

  const {
    data,
    error
  } =
    await supabase.rpc(
      "username_available",
      {
        candidate:
          username.toLowerCase()
      }
    );


  if (error) {

    console.error(
      "username check error:",
      error
    );

    return null;

  }


  return data;

}


const usernameInput =
  document.getElementById(
    "signup-username"
  );


const usernameMessage =
  document.getElementById(
    "username-message"
  );


usernameInput.addEventListener(
  "input",
  () => {

    usernameMessage.textContent = "";

    usernameMessage.className =
      "field-message";

  }
);


usernameInput.addEventListener(
  "blur",
  async () => {

    const username =
      usernameInput
        .value
        .trim();


    usernameMessage.textContent = "";

    usernameMessage.className =
      "field-message";


    if (!username) {
      return;
    }


    if (!validUsername(username)) {

      usernameMessage.textContent =
        "Use 3–24 letters, numbers, or underscores.";

      usernameMessage
        .classList
        .add("message-bad");

      return;

    }


    usernameMessage.textContent =
      "Checking username...";


    const available =
      await checkUsername(username);


    usernameMessage.textContent = "";


    if (available === true) {

      usernameMessage.textContent =
        "Username available";

      usernameMessage
        .classList
        .add("message-good");

    }

    else if (available === false) {

      usernameMessage.textContent =
        "That username is already taken.";

      usernameMessage
        .classList
        .add("message-bad");

    }

    else {

      usernameMessage.textContent =
        "Could not check username right now.";

      usernameMessage
        .classList
        .add("message-bad");

    }

  }
);


const passwordInput =
  document.getElementById(
    "signup-password"
  );


passwordInput.addEventListener(
  "input",
  () => {

    const password =
      passwordInput.value;


    document
      .getElementById("rule-length")
      .classList
      .toggle(
        "valid",
        password.length >= 8
      );


    document
      .getElementById("rule-upper")
      .classList
      .toggle(
        "valid",
        /[A-Z]/.test(password)
      );


    document
      .getElementById("rule-lower")
      .classList
      .toggle(
        "valid",
        /[a-z]/.test(password)
      );


    document
      .getElementById("rule-number")
      .classList
      .toggle(
        "valid",
        /[0-9]/.test(password)
      );

  }
);


document
  .getElementById("show-login")
  .addEventListener(
    "click",
    () => {

      showView(
        "login-view"
      );

    }
  );


document
  .getElementById("show-signup")
  .addEventListener(
    "click",
    () => {

      showView(
        "signup-view"
      );

    }
  );


document
  .getElementById(
    "confirmation-login"
  )
  .addEventListener(
    "click",
    () => {

      showView(
        "login-view"
      );

    }
  );


document
  .getElementById(
    "signup-form"
  )
  .addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const errorBox =
        document.getElementById(
          "signup-error"
        );


      const button =
        document.getElementById(
          "signup-button"
        );


      errorBox.textContent = "";


      const email =
        document
          .getElementById(
            "signup-email"
          )
          .value
          .trim()
          .toLowerCase();


      const username =
        document
          .getElementById(
            "signup-username"
          )
          .value
          .trim()
          .toLowerCase();


      const password =
        document
          .getElementById(
            "signup-password"
          )
          .value;


      const confirmPassword =
        document
          .getElementById(
            "signup-confirm-password"
          )
          .value;


      if (
        !isNortheasternEmail(email)
      ) {

        errorBox.textContent =
          "Please use your @northeastern.edu email address.";

        return;

      }


      if (
        !validUsername(username)
      ) {

        errorBox.textContent =
          "Username must be 3–24 letters, numbers, or underscores.";

        return;

      }


      const available =
        await checkUsername(
          username
        );


      if (
        available === false
      ) {

        errorBox.textContent =
          "That username is already taken.";

        return;

      }


      if (
        available === null
      ) {

        errorBox.textContent =
          "Could not check username availability. Please try again.";

        return;

      }


      if (
        !validPassword(password)
      ) {

        errorBox.textContent =
          "Password must have at least 8 characters, one uppercase letter, one lowercase letter, and one number.";

        return;

      }


      if (
        password !== confirmPassword
      ) {

        errorBox.textContent =
          "Passwords do not match.";

        return;

      }


      setButtonLoading(
        button,
        true,
        "Create account",
        "Creating account..."
      );


      const {
        data,
        error
      } =
        await supabase.auth.signUp({
          email,
          password,

          options: {

            data: {
              username
            },

            emailRedirectTo:
              window.location.origin

          }
        });


      setButtonLoading(
        button,
        false,
        "Create account",
        "Creating account..."
      );


      if (error) {

        console.error(
          "signup error:",
          error
        );


        if (
          error.message
            .toLowerCase()
            .includes("database")
        ) {

          errorBox.textContent =
            "We could not create the account. The username may already be taken.";

        }

        else {

          errorBox.textContent =
            error.message;

        }


        return;

      }


      if (
        data.session
      ) {

        await loadAuthenticatedUser();

        return;

      }


      document
        .getElementById(
          "confirmation-email"
        )
        .textContent =
          email;


      showView(
        "confirmation-view"
      );

    }
  );


document
  .getElementById(
    "login-form"
  )
  .addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const errorBox =
        document.getElementById(
          "login-error"
        );


      const button =
        document.getElementById(
          "login-button"
        );


      errorBox.textContent = "";


      const email =
        document
          .getElementById(
            "login-email"
          )
          .value
          .trim()
          .toLowerCase();


      const password =
        document
          .getElementById(
            "login-password"
          )
          .value;


      if (
        !isNortheasternEmail(email)
      ) {

        errorBox.textContent =
          "Please use your @northeastern.edu email address.";

        return;

      }


      setButtonLoading(
        button,
        true,
        "Sign in",
        "Signing in..."
      );


      const {
        error
      } =
        await supabase.auth
          .signInWithPassword({
            email,
            password
          });


      setButtonLoading(
        button,
        false,
        "Sign in",
        "Signing in..."
      );


      if (error) {

        console.error(
          "login error:",
          error
        );


        if (
          error.message
            .toLowerCase()
            .includes(
              "email not confirmed"
            )
        ) {

          errorBox.textContent =
            "Please confirm your Northeastern email before signing in.";

        }

        else if (
          error.message
            .toLowerCase()
            .includes(
              "invalid login credentials"
            )
        ) {

          errorBox.textContent =
            "Incorrect email or password.";

        }

        else {

          errorBox.textContent =
            error.message;

        }


        return;

      }


      await loadAuthenticatedUser();

    }
  );


const studentPath =
  document.getElementById(
    "student-path"
  );


studentPath.addEventListener(
  "change",
  () => {

    const path =
      studentPath.value;


    const campusSection =
      document.getElementById(
        "campus-section"
      );


    const nuinSection =
      document.getElementById(
        "nuin-section"
      );


    campusSection
      .classList
      .add("hidden");


    nuinSection
      .classList
      .add("hidden");


    if (
      path === "campus"
    ) {

      campusSection
        .classList
        .remove("hidden");

    }


    if (
      path === "nuin"
    ) {

      nuinSection
        .classList
        .remove("hidden");

    }

  }
);


function getCampusForPath(path) {

  if (
    path === "campus"
  ) {

    return document
      .getElementById(
        "campus"
      )
      .value;

  }


  if (
    path ===
    "london_scholars"
  ) {

    return "London, UK";

  }


  if (
    path ===
    "nyc_scholars"
  ) {

    return "New York City, NY";

  }


  if (
    path === "nu_immerse"
    ||
    path === "foundation_year"
  ) {

    return "Boston, MA";

  }


  if (
    path === "nuin"
  ) {

    return "Boston, MA";

  }


  return null;

}


document
  .getElementById(
    "verification-form"
  )
  .addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const errorBox =
        document.getElementById(
          "verification-error"
        );


      const button =
        document.getElementById(
          "verification-button"
        );


      errorBox.textContent = "";


      const {
        data: {
          user
        },
        error: userError
      } =
        await supabase.auth
          .getUser();


      if (
        userError
        ||
        !user
      ) {

        errorBox.textContent =
          "Your session expired. Please sign in again.";

        showView(
          "login-view"
        );

        return;

      }


      const college =
        document
          .getElementById(
            "college"
          )
          .value;


      const graduationYear =
        Number(
          document
            .getElementById(
              "graduation-year"
            )
            .value
        );


      const path =
        studentPath.value;


      if (
        !college
        ||
        !graduationYear
        ||
        !path
      ) {

        errorBox.textContent =
          "Please complete all required fields.";

        return;

      }


      const campus =
        getCampusForPath(
          path
        );


      if (
        path === "campus"
        &&
        !campus
      ) {

        errorBox.textContent =
          "Please select your Northeastern campus.";

        return;

      }


      let nuinYear = null;

      let nuinLocation = null;


      if (
        path === "nuin"
      ) {

        nuinYear =
          Number(
            document
              .getElementById(
                "nuin-year"
              )
              .value
          );


        nuinLocation =
          document
            .getElementById(
              "nuin-location"
            )
            .value;


        if (
          !nuinYear
          ||
          !nuinLocation
        ) {

          errorBox.textContent =
            "Please select your N.U.in year and location.";

          return;

        }

      }


      setButtonLoading(
        button,
        true,
        "Complete verification",
        "Saving..."
      );


      const {
        data,
        error
      } =
        await supabase
          .from(
            "student_verifications"
          )
          .upsert(
            {
              user_id:
                user.id,

              graduation_year:
                graduationYear,

              college,

              student_path:
                path,

              campus,

              nuin_entry_year:
                nuinYear,

              nuin_location:
                nuinLocation,

              verification_method:
                "northeastern_email",

              updated_at:
                new Date()
                  .toISOString()
            },
            {
              onConflict:
                "user_id"
            }
          )
          .select()
          .single();


      setButtonLoading(
        button,
        false,
        "Complete verification",
        "Saving..."
      );


      if (error) {

        console.error(
          "verification save error:",
          error
        );

        errorBox.textContent =
          "Could not save your verification information. Please try again.";

        return;

      }


      showCompleted(
        user.email,
        data.enrollment_status
      );

    }
  );


function showCompleted(
  email,
  status
) {

  document
    .getElementById(
      "complete-email"
    )
    .textContent =
      email;


  const plausible =
    document.getElementById(
      "plausible-status"
    );


  const review =
    document.getElementById(
      "review-status"
    );


  plausible
    .classList
    .add("hidden");


  review
    .classList
    .add("hidden");


  if (
    status === "plausible"
  ) {

    plausible
      .classList
      .remove("hidden");

  }

  else {

    review
      .classList
      .remove("hidden");

  }


  showView(
    "complete-view"
  );

}


async function loadAuthenticatedUser() {

  const {
    data: {
      user
    },
    error
  } =
    await supabase.auth
      .getUser();


  if (
    error
    ||
    !user
  ) {

    showView(
      "signup-view"
    );

    return;

  }


  if (
    !user.email_confirmed_at
  ) {

    document
      .getElementById(
        "confirmation-email"
      )
      .textContent =
        user.email;


    showView(
      "confirmation-view"
    );

    return;

  }


  document
    .getElementById(
      "verified-email"
    )
    .textContent =
      user.email;


  const {
    data: verification,
    error: verificationError
  } =
    await supabase
      .from(
        "student_verifications"
      )
      .select("*")
      .eq(
        "user_id",
        user.id
      )
      .maybeSingle();


  if (
    verificationError
  ) {

    console.error(
      "verification load error:",
      verificationError
    );

  }


  if (
    verification
  ) {

    showCompleted(
      user.email,
      verification.enrollment_status
    );

    return;

  }


  showView(
    "verification-view"
  );

}


document
  .getElementById(
    "signout-button"
  )
  .addEventListener(
    "click",
    async () => {

      await supabase.auth
        .signOut();


      document
        .getElementById(
          "signup-form"
        )
        .reset();


      document
        .getElementById(
          "login-form"
        )
        .reset();


      showView(
        "signup-view"
      );

    }
  );


supabase.auth
  .onAuthStateChange(
    (
      event,
      session
    ) => {

      if (
        event === "SIGNED_IN"
        &&
        session
      ) {

        setTimeout(
          () => {

            loadAuthenticatedUser();

          },
          0
        );

      }


      if (
        event === "SIGNED_OUT"
      ) {

        showView(
          "signup-view"
        );

      }

    }
  );


async function initialize() {

  const {
    data: {
      session
    }
  } =
    await supabase.auth
      .getSession();


  if (
    session
  ) {

    await loadAuthenticatedUser();

  }

  else {

    showView(
      "signup-view"
    );

  }

}


initialize();