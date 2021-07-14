const sys = require('util')
const exec = require('child_process').exec;

const data1 = `temp=34.9'C`;
const data2 = `total        used        free      shared  buff/cache   available
Mem:            927          27         805          11          94         840
Swap:            99           0          99`;
const data3 = `Filesystem      Size  Used Avail Use% Mounted on
/dev/root       7.1G  1.2G  5.6G  18% /
devtmpfs        460M     0  460M   0% /dev
tmpfs           464M     0  464M   0% /dev/shm
tmpfs           464M   12M  452M   3% /run
tmpfs           5.0M  4.0K  5.0M   1% /run/lock
tmpfs           464M     0  464M   0% /sys/fs/cgroup
/dev/mmcblk0p1   42M   21M   21M  51% /boot
tmpfs            93M     0   93M   0% /run/user/1000`;
const data4 = `pi3\n`;

const cmd1 = "vcgencmd measure_temp";
let sysInfo = {
  hostname: '',
  time: '',
  cpu_temperature: 0,
  total_mem: 0,
  used_mem: 0,
  available_mem: 0,
  used_mem_rate: 0,
  total_disk: 0,
  used_disk: 0,
  available_disk: 0,
  used_disk_rate: 0
};

function handle1(error, stdout, stderr) {
  var arr = [0];
  try {
    arr = stdout.split('=');
    arr = arr[1].split("'");
  } catch (e) {
    console.log(e.message);
  }

  console.log(stdout, arr[0]);
  sysInfo.cpu_temperature = arr[0];
}

const cmd2 = "free -m";
function handle2(error, stdout, stderr) {
  var arr = [0];
  try {
    arr = stdout.split('\n');
    arr = arr[1].split(/\s+/);

    sysInfo.total_mem     = arr[1];
    sysInfo.used_mem      = arr[2];
    sysInfo.available_mem = arr[6];
    if (parseInt(sysInfo.total_mem))
      sysInfo.used_mem_rate = Math.round(parseInt(sysInfo.used_mem) * 100 / parseInt(sysInfo.total_mem)) + '%';
    console.log(String.parseInt(sysInfo.used_mem), String.parseInt(sysInfo.total_mem));
  } catch (e) {
    console.log(e.message);
  }

  console.log(stdout, arr);
}

const cmd3 = "df -h";
function handle3(error, stdout, stderr) {
  var arr = [0];
  try {
    arr = stdout.split('\n');
    arr = arr[1].split(/\s+/);

    sysInfo.total_disk     = arr[1];
    sysInfo.used_disk      = arr[2];
    sysInfo.available_disk = arr[3];
    sysInfo.used_disk_rate = arr[4];
  } catch (e) {
    console.log(e.message);
  }

  console.log(stdout, arr);
}

const cmd4 = "hostname";
function handle4 (error, stdout, stderr) {
  let arr = stdout.split('\n');
  sysInfo.hostname = arr[0];
}

exports.getStatus = function () {
  if (process.env.NODE_ENV === 'simulator') {
    handle1(null, data1);
    handle2(null, data2);
    handle3(null, data3);
    handle4(null, data4);
  } else {
    exec(cmd1, handle1);
    exec(cmd2, handle2);
    exec(cmd3, handle3);
    exec(cmd4, handle4);
  }

  sysInfo.time = new Date().toString();
  //console.log(sysInfo);
  return sysInfo;
}
