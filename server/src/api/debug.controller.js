export function debugController() {
  return {
    whoami: (req, res) => {
      res.json({
        auth: "disabled",
        user: req.user ?? null,
        note: "All routes are public for the demo."
      });
    }
  };
}
