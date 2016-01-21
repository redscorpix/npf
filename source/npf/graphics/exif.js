goog.provide('npf.graphics.Exif');


/**
 * @param {!ArrayBuffer} buffer
 * @constructor
 * @struct
 */
npf.graphics.Exif = function(buffer) {

  /**
   * @private {number}
   */
  this._byteLength = buffer.byteLength;

  /**
   * @private {!DataView}
   */
  this._dataView = new DataView(buffer);
};


/**
 * @enum {string}
 */
npf.graphics.Exif.GpsTag = {
  0x0000: 'GPSVersionID',
  0x0001: 'GPSLatitudeRef',
  0x0002: 'GPSLatitude',
  0x0003: 'GPSLongitudeRef',
  0x0004: 'GPSLongitude',
  0x0005: 'GPSAltitudeRef',
  0x0006: 'GPSAltitude',
  0x0007: 'GPSTimeStamp',
  0x0008: 'GPSSatellites',
  0x0009: 'GPSStatus',
  0x000A: 'GPSMeasureMode',
  0x000B: 'GPSDOP',
  0x000C: 'GPSSpeedRef',
  0x000D: 'GPSSpeed',
  0x000E: 'GPSTrackRef',
  0x000F: 'GPSTrack',
  0x0010: 'GPSImgDirectionRef',
  0x0011: 'GPSImgDirection',
  0x0012: 'GPSMapDatum',
  0x0013: 'GPSDestLatitudeRef',
  0x0014: 'GPSDestLatitude',
  0x0015: 'GPSDestLongitudeRef',
  0x0016: 'GPSDestLongitude',
  0x0017: 'GPSDestBearingRef',
  0x0018: 'GPSDestBearing',
  0x0019: 'GPSDestDistanceRef',
  0x001A: 'GPSDestDistance',
  0x001B: 'GPSProcessingMethod',
  0x001C: 'GPSAreaInformation',
  0x001D: 'GPSDateStamp',
  0x001E: 'GPSDifferential'
};

/**
 * @enum {string}
 */
npf.graphics.Exif.TiffTag = {
  0x0100: 'ImageWidth',
  0x0101: 'ImageHeight',
  0x0102: 'BitsPerSample',
  0x0103: 'Compression',
  0x0106: 'PhotometricInterpretation',
  0x010E: 'ImageDescription',
  0x010F: 'Make',
  0x0110: 'Model',
  0x0111: 'StripOffsets',
  0x0112: 'Orientation',
  0x0115: 'SamplesPerPixel',
  0x0116: 'RowsPerStrip',
  0x0117: 'StripByteCounts',
  0x011A: 'XResolution',
  0x011B: 'YResolution',
  0x011C: 'PlanarConfiguration',
  0x0128: 'ResolutionUnit',
  0x012D: 'TransferFunction',
  0x0131: 'Software',
  0x0132: 'DateTime',
  0x013B: 'Artist',
  0x013E: 'WhitePoint',
  0x013F: 'PrimaryChromaticities',
  0x0201: 'JPEGInterchangeFormat',
  0x0202: 'JPEGInterchangeFormatLength',
  0x0211: 'YCbCrCoefficients',
  0x0212: 'YCbCrSubSampling',
  0x0213: 'YCbCrPositioning',
  0x0214: 'ReferenceBlackWhite',
  0x8298: 'Copyright',
  0x8769: 'ExifIFDPointer',
  0x8825: 'GPSInfoIFDPointer',
  0xA005: 'InteroperabilityIFDPointer'
};

/**
 * @enum {string}
 */
npf.graphics.Exif.Tag = {
  // version tags
  0x9000: 'ExifVersion',             // EXIF version
  0xA000: 'FlashpixVersion',         // Flashpix format version

  // colorspace tags
  0xA001: 'ColorSpace',              // Color space information tag

  // image configuration
  0xA002: 'PixelXDimension',         // Valid width of meaningful image
  0xA003: 'PixelYDimension',         // Valid height of meaningful image
  0x9101: 'ComponentsConfiguration', // Information about channels
  0x9102: 'CompressedBitsPerPixel',  // Compressed bits per pixel

  // user information
  0x927C: 'MakerNote',    // Any desired information written by the manufacturer
  0x9286: 'UserComment',  // Comments by user

  // related file
  0xA004: 'RelatedSoundFile',        // Name of related sound file

  // date and time
  0x9003: 'DateTimeOriginal',     // Date and time when the original image
                                  // was generated
  0x9004: 'DateTimeDigitized',    // Date and time when the image was stored
                                  // digitally
  0x9290: 'SubsecTime',           // Fractions of seconds for DateTime
  0x9291: 'SubsecTimeOriginal',   // Fractions of seconds for DateTimeOriginal
  0x9292: 'SubsecTimeDigitized',  // Fractions of seconds for DateTimeDigitized

  // picture-taking conditions
  0x829A: 'ExposureTime',             // Exposure time (in seconds)
  0x829D: 'FNumber',                  // F number
  0x8822: 'ExposureProgram',          // Exposure program
  0x8824: 'SpectralSensitivity',      // Spectral sensitivity
  0x8827: 'ISOSpeedRatings',          // ISO speed rating
  0x8828: 'OECF',                     // Optoelectric conversion factor
  0x9201: 'ShutterSpeedValue',        // Shutter speed
  0x9202: 'ApertureValue',            // Lens aperture
  0x9203: 'BrightnessValue',          // Value of brightness
  0x9204: 'ExposureBias',             // Exposure bias
  0x9205: 'MaxApertureValue',         // Smallest F number of lens
  0x9206: 'SubjectDistance',          // Distance to subject in meters
  0x9207: 'MeteringMode',             // Metering mode
  0x9208: 'LightSource',              // Kind of light source
  0x9209: 'Flash',                    // Flash status
  0x9214: 'SubjectArea',              // Location and area of main subject
  0x920A: 'FocalLength',              // Focal length of the lens in mm
  0xA20B: 'FlashEnergy',              // Strobe energy in BCPS
  0xA20C: 'SpatialFrequencyResponse',
  0xA20E: 'FocalPlaneXResolution',    // Number of pixels in width direction
                                      // per FocalPlaneResolutionUnit
  0xA20F: 'FocalPlaneYResolution',    // Number of pixels in height direction
                                      // per FocalPlaneResolutionUnit
  0xA210: 'FocalPlaneResolutionUnit', // Unit for measuring
                                      // FocalPlaneXResolution and
                                      // FocalPlaneYResolution
  0xA214: 'SubjectLocation',          // Location of subject in image
  0xA215: 'ExposureIndex',            // Exposure index selected on camera
  0xA217: 'SensingMethod',            // Image sensor type
  0xA300: 'FileSource',               // Image source (3 == DSC)
  0xA301: 'SceneType',                // Scene type (1 == directly photographed)
  0xA302: 'CFAPattern',               // Color filter array geometric pattern
  0xA401: 'CustomRendered',           // Special processing
  0xA402: 'ExposureMode',             // Exposure mode
  0xA403: 'WhiteBalance',             // 1 = auto white balance, 2 = manual
  0xA404: 'DigitalZoomRation',        // Digital zoom ratio
  0xA405: 'FocalLengthIn35mmFilm',    // Equivalent foacl length assuming
                                      // 35mm film camera (in mm)
  0xA406: 'SceneCaptureType',         // Type of scene
  0xA407: 'GainControl',              // Degree of overall image gain adjustment
  0xA408: 'Contrast',                 // Direction of contrast processing
                                      // applied by camera
  0xA409: 'Saturation',               // Direction of saturation processing
                                      // applied by camera
  0xA40A: 'Sharpness',                // Direction of sharpness processing
                                      // applied by camera
  0xA40B: 'DeviceSettingDescription',
  0xA40C: 'SubjectDistanceRange',     // Distance to subject

  // other tags
  0xA005: 'InteroperabilityIFDPointer',
  0xA420: 'ImageUniqueID'             // Identifier assigned uniquely
                                      // to each image
};

/**
 * @enum {string}
 */
npf.graphics.Exif.ExposureProgram = {
  0: 'Not defined',
  1: 'Manual',
  2: 'Normal program',
  3: 'Aperture priority',
  4: 'Shutter priority',
  5: 'Creative program',
  6: 'Action program',
  7: 'Portrait mode',
  8: 'Landscape mode'
};

/**
 * @enum {string}
 */
npf.graphics.Exif.MeteringMode = {
  0: 'Unknown',
  1: 'Average',
  2: 'CenterWeightedAverage',
  3: 'Spot',
  4: 'MultiSpot',
  5: 'Pattern',
  6: 'Partial',
  255: 'Other'
};

/**
 * @enum {string}
 */
npf.graphics.Exif.LightSource = {
  0: 'Unknown',
  1: 'Daylight',
  2: 'Fluorescent',
  3: 'Tungsten (incandescent light)',
  4: 'Flash',
  9: 'Fine weather',
  10: 'Cloudy weather',
  11: 'Shade',
  12: 'Daylight fluorescent (D 5700 - 7100K)',
  13: 'Day white fluorescent (N 4600 - 5400K)',
  14: 'Cool white fluorescent (W 3900 - 4500K)',
  15: 'White fluorescent (WW 3200 - 3700K)',
  17: 'Standard light A',
  18: 'Standard light B',
  19: 'Standard light C',
  20: 'D55',
  21: 'D65',
  22: 'D75',
  23: 'D50',
  24: 'ISO studio tungsten',
  255: 'Other'
};

/**
 * @enum {string}
 */
npf.graphics.Exif.Flash = {
  0x0000: 'Flash did not fire',
  0x0001: 'Flash fired',
  0x0005: 'Strobe return light not detected',
  0x0007: 'Strobe return light detected',
  0x0009: 'Flash fired, compulsory flash mode',
  0x000D: 'Flash fired, compulsory flash mode, return light not detected',
  0x000F: 'Flash fired, compulsory flash mode, return light detected',
  0x0010: 'Flash did not fire, compulsory flash mode',
  0x0018: 'Flash did not fire, auto mode',
  0x0019: 'Flash fired, auto mode',
  0x001D: 'Flash fired, auto mode, return light not detected',
  0x001F: 'Flash fired, auto mode, return light detected',
  0x0020: 'No flash function',
  0x0041: 'Flash fired, red-eye reduction mode',
  0x0045: 'Flash fired, red-eye reduction mode, return light not detected',
  0x0047: 'Flash fired, red-eye reduction mode, return light detected',
  0x0049: 'Flash fired, compulsory flash mode, red-eye reduction mode',
  0x004D: 'Flash fired, compulsory flash mode, red-eye reduction mode, ' +
          'return light not detected',
  0x004F: 'Flash fired, compulsory flash mode, red-eye reduction mode, ' +
          'return light detected',
  0x0059: 'Flash fired, auto mode, red-eye reduction mode',
  0x005D: 'Flash fired, auto mode, return light not detected, red-eye ' +
          'reduction mode',
  0x005F: 'Flash fired, auto mode, return light detected, red-eye reduction ' +
          'mode'
};

/**
 * @enum {string}
 */
npf.graphics.Exif.SensingMethod = {
  1: 'Not defined',
  2: 'One-chip color area sensor',
  3: 'Two-chip color area sensor',
  4: 'Three-chip color area sensor',
  5: 'Color sequential area sensor',
  7: 'Trilinear sensor',
  8: 'Color sequential linear sensor'
};

/**
 * @enum {string}
 */
npf.graphics.Exif.SceneCaptureType = {
  0: 'Standard',
  1: 'Landscape',
  2: 'Portrait',
  3: 'Night scene'
};

/**
 * @enum {string}
 */
npf.graphics.Exif.SceneType = {
  1: 'Directly photographed'
};

/**
 * @enum {string}
 */
npf.graphics.Exif.CustomRendered = {
  0: 'Normal process',
  1: 'Custom process'
};

/**
 * @enum {string}
 */
npf.graphics.Exif.WhiteBalance = {
  0: 'Auto white balance',
  1: 'Manual white balance'
};

/**
 * @enum {string}
 */
npf.graphics.Exif.GainControl = {
  0: 'None',
  1: 'Low gain up',
  2: 'High gain up',
  3: 'Low gain down',
  4: 'High gain down'
};

/**
 * @enum {string}
 */
npf.graphics.Exif.Contrast = {
  0: 'Normal',
  1: 'Soft',
  2: 'Hard'
};

/**
 * @enum {string}
 */
npf.graphics.Exif.Saturation = {
  0: 'Normal',
  1: 'Low saturation',
  2: 'High saturation'
};

/**
 * @enum {string}
 */
npf.graphics.Exif.Sharpness = {
  0: 'Normal',
  1: 'Soft',
  2: 'Hard'
};

/**
 * @enum {string}
 */
npf.graphics.Exif.SubjectDistanceRange = {
  0: 'Unknown',
  1: 'Macro',
  2: 'Close view',
  3: 'Distant view'
};

/**
 * @enum {string}
 */
npf.graphics.Exif.FileSource = {
  3: 'DSC'
};

/**
 * @enum {string}
 */
npf.graphics.Exif.Components = {
  0: '',
  1: 'Y',
  2: 'Cb',
  3: 'Cr',
  4: 'R',
  5: 'G',
  6: 'B'
};

/**
 * @enum {string}
 */
npf.graphics.Exif.IptcFieldMap = {
  0x78: 'caption',
  0x6E: 'credit',
  0x19: 'keywords',
  0x37: 'dateCreated',
  0x50: 'byline',
  0x55: 'bylineTitle',
  0x7A: 'captionWriter',
  0x69: 'headline',
  0x74: 'copyright',
  0x0F: 'category'
};


/**
 * @return {Object<string|number|Array<number>>}
 */
npf.graphics.Exif.prototype.getExif = function() {
  if (
    0xFF != this._dataView.getUint8(0) ||
    0xD8 != this._dataView.getUint8(1)
  ) {
    return null; // not a valid jpeg
  }

  /** @type {number} */
  var offset = 2;

  while (offset < this._byteLength) {
    if (this._dataView.getUint8(offset) != 0xFF) {
      return null; // not a valid marker, something is wrong
    }

    var marker = this._dataView.getUint8(offset + 1);

    // we could implement handling for other markers here,
    // but we're only looking for 0xFFE1 for EXIF data

    if (225 == marker) {
      return this._readExifData(offset + 4);
    } else {
      offset += 2 + this._dataView.getUint16(offset+2);
    }
  }

  return null;
};

/**
 * @param {number} start
 * @return {Object<string|number|Array<number>>}
 * @private
 */
npf.graphics.Exif.prototype._readExifData = function(start) {
  if ('Exif' != this._getStringFromDb(start, 4)) {
    return null;
  }

  /** @type {boolean} */
  var bigEnd;
  /** @type {number} */
  var tiffOffset = start + 6;

  // test for TIFF validity and endianness
  if (this._dataView.getUint16(tiffOffset) == 0x4949) {
    bigEnd = false;
  } else if (this._dataView.getUint16(tiffOffset) == 0x4D4D) {
    bigEnd = true;
  } else {
    // Not valid TIFF data!
    return null;
  }

  if (this._dataView.getUint16(tiffOffset+2, !bigEnd) != 0x002A) {
    // Not valid TIFF data!
    return null;
  }

  /** @type {number} */
  var firstIFDOffset = this._dataView.getUint32(tiffOffset + 4, !bigEnd);

  if (firstIFDOffset < 0x00000008) {
    // Not valid TIFF data!
    return null;
  }

  /** @type {!Object<string|number|Array<number>>} */
  var tags = this._readTags(
    tiffOffset, tiffOffset + firstIFDOffset, npf.graphics.Exif.TiffTag, bigEnd);
  var exifIfdPointer = tags['ExifIFDPointer'];

  if (exifIfdPointer && goog.isNumber(exifIfdPointer)) {
    /** @type {!Object<string|number|Array<number>>} */
    var exifData = this._readTags(
      tiffOffset, tiffOffset + exifIfdPointer, npf.graphics.Exif.Tag, bigEnd);

    for (var tag in exifData) {
      switch (tag) {
        case 'LightSource':
          exifData[tag] = npf.graphics.Exif.LightSource[exifData[tag]] || null;
          break;
        case 'Flash':
          exifData[tag] = npf.graphics.Exif.Flash[exifData[tag]] || null;
          break;
        case 'MeteringMode':
          exifData[tag] = npf.graphics.Exif.MeteringMode[exifData[tag]] || null;
          break;
        case 'ExposureProgram':
          exifData[tag] =
            npf.graphics.Exif.ExposureProgram[exifData[tag]] || null;
          break;
        case 'SensingMethod':
          exifData[tag] =
            npf.graphics.Exif.SensingMethod[exifData[tag]] || null;
          break;
        case 'SceneCaptureType':
          exifData[tag] =
            npf.graphics.Exif.SceneCaptureType[exifData[tag]] || null;
          break;
        case 'SceneType':
          exifData[tag] = npf.graphics.Exif.SceneType[exifData[tag]] || null;
          break;
        case 'CustomRendered':
          exifData[tag] =
            npf.graphics.Exif.CustomRendered[exifData[tag]] || null;
          break;
        case 'WhiteBalance':
          exifData[tag] = npf.graphics.Exif.WhiteBalance[exifData[tag]] || null;
          break;
        case 'GainControl':
          exifData[tag] = npf.graphics.Exif.GainControl[exifData[tag]] || null;
          break;
        case 'Contrast':
          exifData[tag] = npf.graphics.Exif.Contrast[exifData[tag]] || null;
          break;
        case 'Saturation':
          exifData[tag] = npf.graphics.Exif.Saturation[exifData[tag]] || null;
          break;
        case 'Sharpness':
          exifData[tag] = npf.graphics.Exif.Sharpness[exifData[tag]] || null;
          break;
        case 'SubjectDistanceRange':
          exifData[tag] =
            npf.graphics.Exif.SubjectDistanceRange[exifData[tag]] || null;
          break;
        case 'FileSource':
          exifData[tag] = npf.graphics.Exif.FileSource[exifData[tag]] || null;
          break;

        case 'ExifVersion':
        case 'FlashpixVersion':
          exifData[tag] = String.fromCharCode(
            exifData[tag][0], exifData[tag][1],
            exifData[tag][2], exifData[tag][3]);
          break;

        case 'ComponentsConfiguration':
          exifData[tag] =
            npf.graphics.Exif.Components[exifData[tag][0]] +
            npf.graphics.Exif.Components[exifData[tag][1]] +
            npf.graphics.Exif.Components[exifData[tag][2]] +
            npf.graphics.Exif.Components[exifData[tag][3]];
          break;
      }

      tags[tag] = exifData[tag];
    }
  }

  var gpsInfoIfdPointer = tags['GPSInfoIFDPointer'];

  if (gpsInfoIfdPointer && goog.isNumber(gpsInfoIfdPointer)) {
    /** @type {!Object<string|number|Array<number>>} */
    var gpsData = this._readTags(tiffOffset,
      tiffOffset + gpsInfoIfdPointer, npf.graphics.Exif.GpsTag, bigEnd);

    for (tag in gpsData) {
      switch (tag) {
        case 'GPSVersionID':
          gpsData[tag] = gpsData[tag][0] +
            '.' + gpsData[tag][1] +
            '.' + gpsData[tag][2] +
            '.' + gpsData[tag][3];
            break;
      }

      tags[tag] = gpsData[tag];
    }
  }

  return tags;
};

/**
 * @return {Object<string>}
 */
npf.graphics.Exif.prototype.getIptCin = function() {
  if (
    0xFF != this._dataView.getUint8(0) ||
    0xD8 != this._dataView.getUint8(1)
  ) {
    return null; // not a valid jpeg
  }

  /** @type {number} */
  var offset = 2;

  while (offset < this._byteLength) {
    if (
      0x38 == this._dataView.getUint8(offset) &&
      0x42 == this._dataView.getUint8(offset + 1) &&
      0x49 == this._dataView.getUint8(offset + 2) &&
      0x4D == this._dataView.getUint8(offset + 3) &&
      0x04 == this._dataView.getUint8(offset + 4) &&
      0x04 == this._dataView.getUint8(offset + 5)
    ) {
      // Get the length of the name header
      // (which is padded to an even number of bytes)
      var nameHeaderLength = this._dataView.getUint8(offset + 7);

      if (nameHeaderLength % 2) {
        nameHeaderLength += 1;
      }

      // Check for pre photoshop 6 format
      if (!nameHeaderLength) {
        nameHeaderLength = 4; // Always 4
      }

      /** @type {number} */
      var startOffset = offset + 8 + nameHeaderLength;
      /** @type {number} */
      var sectionLength =
        this._dataView.getUint16(offset + 6 + nameHeaderLength);

      return this._readIptcData(startOffset, sectionLength);
    }

    // Not the marker, continue searching
    offset++;
  }

  return null;
};

/**
 * @param {number} startOffset
 * @param {number} sectionLength
 * @return {!Object<string|!Array>}
 * @private
 */
npf.graphics.Exif.prototype._readIptcData = function(startOffset,
    sectionLength) {
  /** @type {!Object<string|!Array>} */
  var data = {};
  /** @type {number} */
  var segmentStartPos = startOffset;

  while (segmentStartPos < startOffset + sectionLength) {
    if (
      0x1C == this._dataView.getUint8(segmentStartPos) &&
      0x02 == this._dataView.getUint8(segmentStartPos + 1)
    ) {
      /** @type {number} */
      var segmentType = this._dataView.getUint8(segmentStartPos + 2);

      if (segmentType in npf.graphics.Exif.IptcFieldMap) {
        /** @type {number} */
        var dataSize = this._dataView.getInt16(segmentStartPos + 3);
        /** @type {number} */
        var segmentSize = dataSize + 5;
        /** @type {string|undefined} */
        var fieldName = npf.graphics.Exif.IptcFieldMap[segmentType];
        /** @type {string} */
        var fieldValue = this._getStringFromDb(segmentStartPos + 5, dataSize);

        // Check if we already stored a value with this name
        if (fieldName && data.hasOwnProperty(fieldName)) {
          // Value already stored with this name, create multivalue field
          if (data[fieldName] instanceof Array) {
            data[fieldName].push(fieldValue);
          } else {
            data[fieldName] = [data[fieldName], fieldValue];
          }
        } else {
          data[fieldName] = fieldValue;
        }
      }
    }

    segmentStartPos++;
  }

  return data;
};

/**
 * Value | 0th Row     | 0th Column
 * ------+-------------+-----------
 *   1   | top         | left side
 *   2   | top         | right side
 *   3   | bottom      | right side
 *   4   | bottom      | left side
 *   5   | left side   | top
 *   6   | right side  | top
 *   7   | right side  | bottom
 *   8   | left side   | bottom
 *
 * For convenience, here is what the letter F would look like if it were
 * tagged correctly and displayed by a program that ignores the orientation
 * tag:
 *
 *   1        2       3      4        5            6           7          8
 *
 * 888888  888888      88  88     8888888888  88                  88  8888888888
 * 88          88      88  88     88  88      88  88          88  88      88  88
 * 8888      8888    8888  8888   88          8888888888  8888888888          88
 * 88          88      88  88
 * 88          88  888888  888888
 *
 * @return {number?}
 */
npf.graphics.Exif.prototype.getOrientation = function() {
  /** @type {Object<string|number|Array<number>>} */
  var exif = this.getExif();

  if (exif) {
    var value = exif['Orientation'];

    if (goog.isNumber(value) && 0 < value && value < 9) {
      return value;
    }
  }

  return null;
};

/**
 * @param {number} tiffStart
 * @param {number} dirStart
 * @param {!Object<string>} strings
 * @param {boolean} bigEnd
 * @return {!Object<string|number|Array<number>>}
 * @private
 */
npf.graphics.Exif.prototype._readTags = function(tiffStart, dirStart, strings,
    bigEnd) {
  /** @type {number} */
  var entries = this._dataView.getUint16(dirStart, !bigEnd);
  /** @type {!Object<string|number|Array<number>>} */
  var tags = {};

  for (var i = 0; i < entries; i++) {
    /** @type {number} */
    var entryOffset = dirStart + i * 12 + 2;
    /** @type {string|undefined} */
    var tag = strings[this._dataView.getUint16(entryOffset, !bigEnd)];

    if (tag) {
      tags[tag] = this._readTagValue(entryOffset, tiffStart, dirStart, bigEnd);
    }
  }

  return tags;
};

/**
 * @param {number} entryOffset
 * @param {number} tiffStart
 * @param {number} dirStart
 * @param {boolean} bigEnd
 * @return {string|number|Array<number>}
 * @private
 */
npf.graphics.Exif.prototype._readTagValue = function(entryOffset, tiffStart,
    dirStart, bigEnd) {
  /** @type {number} */
  var type = this._dataView.getUint16(entryOffset + 2, !bigEnd);
  /** @type {number} */
  var numValues = this._dataView.getUint32(entryOffset + 4, !bigEnd);
  /** @type {number} */
  var valueOffset =
    this._dataView.getUint32(entryOffset + 8, !bigEnd) + tiffStart;
  /** @type {number} */
  var offset;
  /** @type {!Array<number>} */
  var vals;
  /** @type {number} */
  var n;
  /** @type {number} */
  var numerator;
  /** @type {number} */
  var denominator;

  switch (type) {
    case 1: // byte, 8-bit unsigned int
    case 7: // undefined, 8-bit byte, value depending on field
      if (1 == numValues) {
        return this._dataView.getUint8(entryOffset + 8);
      } else {
        offset = numValues > 4 ? valueOffset : (entryOffset + 8);
        vals = [];

        for (n = 0; n < numValues; n++) {
          vals[n] = this._dataView.getUint8(offset + n);
        }

        return vals;
      }

    case 2: // ascii, 8-bit byte
      offset = numValues > 4 ? valueOffset : (entryOffset + 8);

      return this._getStringFromDb(offset, numValues - 1);

    case 3: // short, 16 bit int
      if (1 == numValues) {
        return this._dataView.getUint16(entryOffset + 8, !bigEnd);
      } else {
        offset = numValues > 2 ? valueOffset : (entryOffset + 8);
        vals = [];

        for (n = 0; n < numValues; n++) {
          vals[n] = this._dataView.getUint16(offset + 2 * n, !bigEnd);
        }

        return vals;
      }

    case 4: // long, 32 bit int
      if (1 == numValues) {
        return this._dataView.getUint32(entryOffset + 8, !bigEnd);
      } else {
        vals = [];

        for (n = 0; n < numValues; n++) {
          vals[n] = this._dataView.getUint32(valueOffset + 4 * n, !bigEnd);
        }

        return vals;
      }

    case 5: // rational = two long values, first is numerator,
            // second is denominator
      if (1 == numValues) {
        numerator = this._dataView.getUint32(valueOffset, !bigEnd);
        denominator = this._dataView.getUint32(valueOffset + 4, !bigEnd);
        var val = new Number(numerator / denominator);
        val.numerator = numerator;
        val.denominator = denominator;

        return val + 0;
      } else {
        vals = [];

        for (n = 0; n < numValues; n++) {
          numerator = this._dataView.getUint32(valueOffset + 8 * n, !bigEnd);
          denominator =
            this._dataView.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
          var num = new Number(numerator / denominator);
          num.numerator = numerator;
          num.denominator = denominator;
          vals[n] = num + 0;
        }

        return vals;
      }

    case 9: // slong, 32 bit signed int
      if (1 == numValues) {
        return this._dataView.getInt32(entryOffset + 8, !bigEnd);
      } else {
        vals = [];

        for (n = 0; n < numValues; n++) {
          vals[n] = this._dataView.getInt32(valueOffset + 4 * n, !bigEnd);
        }

        return vals;
      }

    case 10: // signed rational, two slongs, first is numerator,
             // second is denominator
      if (1 == numValues) {
        return this._dataView.getInt32(valueOffset, !bigEnd) /
          this._dataView.getInt32(valueOffset + 4, !bigEnd);
      } else {
        vals = [];

        for (n = 0; n < numValues; n++) {
          vals[n] = this._dataView.getInt32(valueOffset + 8 * n, !bigEnd) /
            this._dataView.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
        }

        return vals;
      }
  }

  return null;
};

/**
 * @param {number} start
 * @param {number} length
 * @return {string}
 * @private
 */
npf.graphics.Exif.prototype._getStringFromDb = function(start, length) {
  /** @type {string} */
  var outstr = '';
  /** @type {number} */
  var finish = start + length;

  for (var i = start; i < finish; i++) {
    outstr += String.fromCharCode(this._dataView.getUint8(i));
  }

  return outstr;
};
