/*
TimeWalk コースのアイキャッチ画像対応パッチ

既存GASの saveCourse_ と upsertCourse_ を、このファイル内の同名関数へ置き換えてください。
また uploadCourseEyecatch_ と getExistingCourseEyecatch_ を追加してください。
既存の uploadBase64ToCloudinary_ を再利用します。
*/

function saveCourse_(course, points) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    if (!course) {
      throw new Error("courseデータがありません");
    }

    const courseId = String(course.courseId || "").trim();
    const title = String(course.title || "").trim();

    if (!courseId) {
      throw new Error("courseIdがありません");
    }

    if (!title) {
      throw new Error("タイトルがありません");
    }

    if (!Array.isArray(points) || points.length < 2) {
      throw new Error("コース地点を2件以上登録してください");
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const coursesSheet = ss.getSheetByName("courses");
    const pointsSheet = ss.getSheetByName("course_points");

    if (!coursesSheet) {
      throw new Error("coursesシートが見つかりません");
    }

    if (!pointsSheet) {
      throw new Error("course_pointsシートが見つかりません");
    }

    const timezone = Session.getScriptTimeZone() || "Asia/Tokyo";
    const now = Utilities.formatDate(new Date(), timezone, "yyyy-MM-dd HH:mm:ss");

    const existingEyecatch = getExistingCourseEyecatch_(coursesSheet, courseId);
    let eyecatchImageUrl = String(course.eyecatchImage || existingEyecatch || "").trim();

    if (course.removeEyecatchImage === true) {
      eyecatchImageUrl = "";
    } else if (course.eyecatchImageBase64) {
      eyecatchImageUrl = uploadCourseEyecatch_(
        course.eyecatchImageBase64,
        courseId
      );
    }

    const courseForSave = Object.assign({}, course, {
      eyecatchImage: eyecatchImageUrl,
    });

    upsertCourse_(coursesSheet, courseId, courseForSave, now);
    replaceCoursePoints_(pointsSheet, courseId, points, now);

    SpreadsheetApp.flush();

    return {
      ok: true,
      courseId: courseId,
      pointCount: points.length,
      eyecatchImage: eyecatchImageUrl,
    };
  } finally {
    lock.releaseLock();
  }
}

function upsertCourse_(sheet, courseId, course, now) {
  const values = sheet.getDataRange().getValues();

  if (values.length === 0) {
    throw new Error("coursesシートにヘッダーがありません");
  }

  const headers = values[0].map(function (value) {
    return String(value || "").trim();
  });

  const courseIdIndex = headers.indexOf("courseId");

  if (courseIdIndex === -1) {
    throw new Error("coursesシートにcourseId列がありません");
  }

  if (headers.indexOf("eyecatchImage") === -1) {
    throw new Error("coursesシートにeyecatchImage列がありません");
  }

  let targetRow = -1;
  let createdAt = now;

  for (let i = 1; i < values.length; i++) {
    const existingId = String(values[i][courseIdIndex] || "").trim();

    if (existingId === courseId) {
      targetRow = i + 1;

      const createdAtIndex = headers.indexOf("createdAt");
      if (createdAtIndex !== -1 && values[i][createdAtIndex]) {
        createdAt = values[i][createdAtIndex];
      }
      break;
    }
  }

  if (targetRow === -1) {
    targetRow = sheet.getLastRow() + 1;
  }

  const displayOrderValue =
    Number(course.displayOrder) || getNextCourseDisplayOrder_(sheet, headers);

  const rowObject = {
    courseId: courseId,
    status: String(course.status || "draft").trim(),
    title: String(course.title || "").trim(),
    description: String(course.description || "").trim(),
    area: String(course.area || "").trim(),
    distanceKm: Number(course.distanceKm) || 0,
    durationMin: Number(course.durationMin) || 0,
    durationLabel: String(course.durationLabel || "").trim(),
    displayOrder: displayOrderValue,
    createdAt: createdAt,
    updatedAt: now,
    notes: String(course.notes || "").trim(),
    date: String(course.date || "").trim(),
    eyecatchImage: String(course.eyecatchImage || "").trim(),
  };

  const rowValues = headers.map(function (header) {
    if (Object.prototype.hasOwnProperty.call(rowObject, header)) {
      return rowObject[header];
    }
    return "";
  });

  sheet.getRange(targetRow, 1, 1, headers.length).setValues([rowValues]);
}

function getExistingCourseEyecatch_(sheet, courseId) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return "";

  const headers = values[0].map(function (value) {
    return String(value || "").trim();
  });
  const courseIdIndex = headers.indexOf("courseId");
  const imageIndex = headers.indexOf("eyecatchImage");

  if (courseIdIndex === -1 || imageIndex === -1) return "";

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][courseIdIndex] || "").trim() === courseId) {
      return String(values[i][imageIndex] || "").trim();
    }
  }

  return "";
}

function uploadCourseEyecatch_(base64, courseId) {
  const publicId = "course_" + courseId + "_eyecatch";
  const uploadedUrl = uploadBase64ToCloudinary_(base64, publicId);

  return uploadedUrl.replace(
    "/upload/f_auto,q_auto,w_500/",
    "/upload/f_auto,q_auto,c_fill,g_auto,w_1200,h_675/"
  );
}
