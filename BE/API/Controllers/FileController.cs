using BusinessObjects.DTO;
using BusinessObjects.Utils;
using Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    /// <summary>
    /// Xử lý các request liên quan đến file
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private const int MAX_FILE_SIZE = 4 * 1024 * 1024;
        /// <summary>
        /// Upload file lên server
        /// </summary>
        /// <param name="files"></param>
        /// <param name="type"></param>
        /// <param name="renameFile"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ServiceResponse> UploadFile(List<IFormFile> files, EnumFileType type = EnumFileType.Temp, uint renameFile = 1)
        {
            ServiceResponse response = new();

            if (files == null || files.Count == 0)
            {
                response.OnError("File is empty");
                return response;
            }

            if (files.Sum(f => f.Length) > MAX_FILE_SIZE)
            {
                response.OnError("File size is too large");
                return response;
            }

            if (files.Count > 0)
            {
                var fileNames = new List<string>();
                for (int i = 0; i < files.Count; i++)
                {
                    var file = files[i];
                    var fileExtension = Path.GetExtension(file.FileName);
                    //if (!allowExtention.Contains(fileExtension))
                    //{
                    //    response.OnError("File extension is not allowed");
                    //    return response;
                    //}
                    fileNames.Add(await SaveTempFile(file, type, renameFile));
                }
                response.Onsuccess(fileNames);
            }
            return response;
        }

        /// <summary>
        /// Lấy file từ server
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        [HttpGet("{fileName}")]
        public IActionResult Download(string fileName, EnumFileType type = EnumFileType.Temp)
        {
            var path = Path.Combine(FileUtil.GetFolderPath(type), fileName);
            if (!System.IO.File.Exists(path))
            {
                return NotFound();
            }
            var stream = System.IO.File.OpenRead(path);
            return File(stream, "application/octet-stream");
        }

        /// <summary>
        /// Xử lý lấy ảnh, và crop các kiểu
        /// </summary>
        /// <param name="type"></param>
        /// <param name="fileName"></param>
        /// <param name="width"></param>
        /// <param name="height"></param>
        /// <param name="resizeIfWider"></param>
        /// <param name="resizeImageAndRatio"></param>
        /// <returns></returns>
        [HttpGet("image/{fileName}")]
        public ActionResult Image(EnumFileType type, string fileName, int? width, int? height, bool resizeIfWider = true, bool resizeImageAndRatio = true)
        {
            string tmp_fileName = fileName;
            var path = Path.Combine(FileUtil.GetFolderPath(type), fileName);
            if (!System.IO.File.Exists(path))
            {
                return NotFound();
            }
            var extension = Path.GetExtension(fileName);
            byte[] imageByte = null;

            if (width.HasValue && height.HasValue)
            {
                if (resizeImageAndRatio)
                {
                    imageByte = ImageResizer.ResizeImageAndRatio(path, width.Value, height.Value, resizeIfWider);
                }
                else
                {
                    imageByte = ImageResizer.ResizeImage(path, width.Value, height.Value, resizeIfWider);
                }
            }

            imageByte ??= System.IO.File.ReadAllBytes(path);

            return File(imageByte, "image/" + extension.Replace(".", ""));

            // return File(datas, "image/" + extension.Replace(".", ""));
        }

        /// <summary>
        /// Lưu file tạm thời
        /// </summary>
        /// <param name="file"></param>
        /// <param name="type"></param>
        /// <param name="renameFile"></param>
        /// <returns></returns>
        private async Task<string> SaveTempFile(IFormFile file, EnumFileType type = EnumFileType.Temp, uint renameFile = 1)
        {
            var extension = Path.GetExtension(file.FileName);
            var fileName = string.Format("{0}{1}", Guid.NewGuid(), extension);
            if (renameFile == 0)
            {
                fileName = file.FileName;
            }
            var path = Path.Combine(FileUtil.GetFolderPath(type), fileName);
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return fileName;
        }
    }
}