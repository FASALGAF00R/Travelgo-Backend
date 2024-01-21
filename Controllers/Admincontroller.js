


export const Adminlogin = async (req, res) => {
    console.log("uuuuuu");
    try {
      const { name, email, password } = req.body;
      console.log(req.body);
      console.log( process.env.ADMIN_NAME,"reangiiiiiiiiiiiiiii");
      console.log( process.env.ADMIN_EMAIL,"reangiiiiiiiiiiiiiii");
      console.log( process.env.ADMIN_PASS,"reangiiiiiiiiiiiiiii");

      // Correct the conditions for comparison
      if (name === process.env.ADMIN_NAME && email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
        return res.json({ message: 'it is admin', status: true });
      } else {
        console.log("oooooooooo");
        return res.json({ message: "not admin", success: false });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error", success: false });
    }
  };
  