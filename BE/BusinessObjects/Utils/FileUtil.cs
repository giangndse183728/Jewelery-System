
using Domain.Constants;
using Microsoft.AspNetCore.Http;

namespace BusinessObjects.Utils
{
    public static class FileUtil
    {
        /// <summary>
        /// Chuyển từ thư mục temp sang thư mục thật
        /// </summary>
        public static string SaveTempToReal(string? tempFileName, EnumFileType type, string customPath = "")
        {
            if (string.IsNullOrEmpty(tempFileName))
            {
                return "";
            }

            var tempPath = Path.Combine(GetFolderPath(EnumFileType.Temp), tempFileName);
            if (!File.Exists(tempPath))
            {
                return "";
            }

            var realPath = Path.Combine(GetFolderPath(type, customPath), tempFileName);
            File.Move(tempPath, realPath);

            return tempFileName;
        }

        /// <summary>
        /// Lưu file tạm thời
        /// </summary>
        /// <param name="file"></param>
        /// <param name="type"></param>
        /// <param name="name"></param>
        /// <param name="customPath"></param>
        /// <returns></returns>
        public static string SaveTempFile(IFormFile file, EnumFileType type = EnumFileType.Temp, string name = "", string customPath = "")
        {
            var extension = Path.GetExtension(file.FileName);
            var fileName = "";
            if (string.IsNullOrEmpty(name))
            {
                fileName = string.Format("{0}{1}", Guid.NewGuid(), extension);
            }
            else
            {
                fileName = string.Format("{0}{1}", name, extension);
            }

            var path = Path.Combine(GetFolderPath(type, customPath), fileName);
            using (var stream = new FileStream(path, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            return fileName;
        }

        /// <summary>
        /// Lấy đường dẫn thư mục lưu file
        /// </summary>
        /// <param name="type"></param>
        /// <param name="customPath"></param>
        /// <returns></returns>
        public static string GetFolderPath(EnumFileType type, string customPath = "")
        {
            string path = type switch
            {
                EnumFileType.Temp => "~/Uploads/Temp",
                EnumFileType.Jewellery => "~/Uploads/Jewellery",
                _ => "~/Uploads/Other",
            };

            if (!string.IsNullOrEmpty(customPath))
            {
                path = customPath;
            }

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            return path;
        }

        /// <summary>
        /// Kiểm tra file có tồn tại không
        /// </summary>
        public static bool CheckFileExist(string fileName, EnumFileType type)
        {
            if (string.IsNullOrEmpty(fileName))
            {
                return false;
            }

            var path = Path.Combine(GetFolderPath(type), fileName);
            return File.Exists(path);
        }

        /// <summary>
        /// Xóa file
        /// </summary>
        public static bool DeleteFile(string fileName, EnumFileType type)
        {
            if (string.IsNullOrEmpty(fileName))
            {
                return false;
            }

            var path = Path.Combine(GetFolderPath(type), fileName);
            try
            {
                if (File.Exists(path))
                {
                    File.SetAttributes(path, FileAttributes.Normal);
                    File.Delete(path);
                    return true;
                }
            }
            catch (Exception ex)
            {
                return false;
            }

            return false;
        }
    }
}
