/**
 * package React Native Panel Project
 *
 */
const fs = require("fs");
const path = require("path");
const {exec} = require("child_process");
const logSymbols = require("log-symbols");
const qrcode = require("qrcode-terminal");
const archiver = require("archiver");

let _arguments = {};
const packagePaths = {
  bundle: "package",
  Android: "package/Android",
  iOS: "package/iOS",
};

const parseArguments = function (argv) {
  _arguments = argv;

  const currentExecuteCommandPath = process.cwd();
  _arguments.currentExecuteCommandPath = currentExecuteCommandPath;

  if (argv._.length > 1) {
    const targetPath = argv._[1];
    _arguments.targetPath = path.join(currentExecuteCommandPath, targetPath);
  } else {
    _arguments.targetPath = currentExecuteCommandPath;
  }

  // console.log(arguments);
};

const execShell = (line, callback = () => {
}) => {
  const _process = exec(line, {}, callback);
  _process.stdout.on("data", data => {
    console.log(data);
  });

  _process.stderr.on("data", data => {
    console.log(logSymbols.error, data);
  });
};

const packageJSONFileExists = function (dirPath) {
  const filePath = path.join(dirPath, "package.json");
  if (!fs.existsSync(filePath)) {
    console.log(logSymbols.error, `[Error] Package.json does not exits at: ${filePath}`);
    return false;
  }
  return true;
};

const getApplicationJSONConfigurationContent = function () {
  const fileName = "app.json";
  const filePath = path.join(_arguments.targetPath, fileName);
  // check file exists
  if (!fs.existsSync(filePath)) {
    console.log(logSymbols.error, `[Error] ${fileName} does not exits at: ${filePath}`);
    return false;
  }

  // read content
  try {
    const fileContentInString = fs.readFileSync(filePath, {encoding: "utf8"});
    const fileContentInJSON = JSON.parse(fileContentInString);
    return fileContentInJSON;
  } catch (error) {
    console.log(logSymbols.error, `[Error] Read ${fileName} content failed: ${filePath}`, error);
    return false;
  }
};

const generateZipPackageFileName = function (platform) {
  const applicationConfiguration = getApplicationJSONConfigurationContent();
  if (!applicationConfiguration) {
    return false;
  }

  const applicationConfigurationFormatError = [
    applicationConfiguration.panelType,
    applicationConfiguration.deviceType,
    applicationConfiguration.brand,
    applicationConfiguration.model,
  ].filter(function (item) {
    return item === undefined;
  }).length > 0;
  if (applicationConfigurationFormatError) {
    console.log(logSymbols.error, "[Error] Application configuration content format error.");
    return;
  }

  const zipFileName = `${applicationConfiguration.panelType}_${applicationConfiguration.deviceType}_${applicationConfiguration.brand}_${applicationConfiguration.model}_${platform}`;
  return zipFileName;
};

/**
 * generate package command line string
 * @returns {string | undefined}
 */
const generateCommand = function () {

  const zipPackageFileName = generateZipPackageFileName();
  if (!zipPackageFileName) {
    return;
  }

  const commands = [
    // createFolders
    `mkdir -p ${packagePaths.Android}`,
    `mkdir -p ${packagePaths.iOS}`,
    // package
    `react-native bundle --entry-file index.js --bundle-output ./${packagePaths.Android}/index.mxbundle --platform android --assets-dest ./${packagePaths.Android} --dev false`,
    `react-native bundle --entry-file index.js --bundle-output ./${packagePaths.iOS}/index.mxbundle --platform ios --assets-dest ./${packagePaths.iOS} --dev false`,
  ];
  return commands.join(" && ");
};

const packFolderIntoZipBundle = function (folderPath, targetZipPath) {
  const output = fs.createWriteStream(targetZipPath);
  const archive = archiver("zip", {
    zlib: {level: 9}, // Sets the compression level.
  });
  // listen for all archive data to be written
  // 'close' event is fired only when a file descriptor is involved
  output.on("close", function () {
    console.log(archive.pointer() + " total bytes");
    console.log(logSymbols.success, "[Success] archiver has been finalized and the output file descriptor has closed.");
  });

  // This event is fired when the data source is drained no matter what was the data source.
  // It is not part of this library but rather from the NodeJS Stream API.
  // @see: https://nodejs.org/api/stream.html#stream_event_end
  output.on("end", function () {
    console.log("Data has been drained");
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });

  // good practice to catch this error explicitly
  archive.on("error", function (err) {
    throw err;
  });

  // pipe archive data to the file
  archive.pipe(output);
  archive.directory(folderPath, false);
  archive.finalize();
};

const packFilesIntoZipBundle = function () {
  console.log("Create zip file...");
  const iOSZipFileName = generateZipPackageFileName("iOS");
  const AndroidZipFileName = generateZipPackageFileName("Android");

  if (iOSZipFileName) {
    packFolderIntoZipBundle(
      path.join(_arguments.targetPath, packagePaths.iOS),
      path.join(_arguments.targetPath, packagePaths.bundle, `${iOSZipFileName}.zip`)
    );
  }

  if (AndroidZipFileName) {
    packFolderIntoZipBundle(
      path.join(_arguments.targetPath, packagePaths.iOS),
      path.join(_arguments.targetPath, packagePaths.bundle, `${AndroidZipFileName}.zip`)
    );
  }
};

const copyApplicationConfigurationFile = () => {
  const fileName = "app.json";
  const originalAppJSONFilePath = path.join(_arguments.targetPath, fileName);
  const AndroidAppJSONFilePath = path.join(_arguments.targetPath, packagePaths.Android, fileName);
  const iOSAppJSONFilePath = path.join(_arguments.targetPath, packagePaths.iOS, fileName);

  if (!fs.existsSync(originalAppJSONFilePath)) {
    console.log(logSymbols.error, `[Error] ${fileName} does not exist at ${originalAppJSONFilePath}`);
    return;
  }

  fs.copyFileSync(originalAppJSONFilePath, AndroidAppJSONFilePath);
  fs.copyFileSync(originalAppJSONFilePath, iOSAppJSONFilePath);
};

const runPackageCommand = function () {
  execShell(generateCommand(), (error, stdout, stderr) => {
    if (error) {
      console.log(logSymbols.error, error);
      return;
    }

    copyApplicationConfigurationFile();
    packFilesIntoZipBundle();
  });
};

module.exports.command = "package";
module.exports.describe = "package project";
module.exports.handler = function (argv) {
  parseArguments(argv);
  if (!packageJSONFileExists(_arguments.targetPath)) {
    return;
  }

  runPackageCommand();
};