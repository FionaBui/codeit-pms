export function getHealth(req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'pms-api',
    time: new Date().toISOString(),
  });
}

