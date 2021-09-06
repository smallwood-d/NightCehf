import {ArgumentParser} from 'argparse';

export const ncargs = new ArgumentParser({
  description: 'NightChef server side.',
  add_help: true
});

ncargs.add_argument('-v', '--version',
{
    action: 'store_true',
    help: 'show program\'s version number and exit'
});
ncargs.add_argument('-s', '--server',
{
    action: 'store_true',
    help: 'run NightChef server'
});
