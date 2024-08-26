
using System.Drawing;

namespace BusinessObjects.Utils
{
    public static class ImageResizer
    {
        /// <summary>
        /// Thay đổi kích thước hình ảnh với chiều rộng và chiều cao mới
        /// </summary>
        /// <param name="origFileLocation"></param>
        /// <param name="newFileLocation"></param>
        /// <param name="newFileName"></param>
        /// <param name="newWidth"></param>
        /// <param name="maxHeight"></param>
        /// <param name="resizeIfWider"></param>
        public static byte[] ResizeImage(string origFileLocation, int newWidth, int maxHeight, bool resizeIfWider)
        {
            Image FullSizeImage = Image.FromFile(origFileLocation);
            // Ensure the generated thumbnail is not being used by rotating it 360 degrees
            FullSizeImage.RotateFlip(RotateFlipType.Rotate180FlipNone);
            FullSizeImage.RotateFlip(RotateFlipType.Rotate180FlipNone);

            if (resizeIfWider)
            {
                if (FullSizeImage.Width <= newWidth)
                {
                    //newWidth = FullSizeImage.Width;
                }
            }

            int newHeight = FullSizeImage.Height * newWidth / FullSizeImage.Width;
            if (newHeight > maxHeight) // Height resize if necessary
            {
                //newWidth = FullSizeImage.Width * maxHeight / FullSizeImage.Height;
                newHeight = maxHeight;
            }
            newHeight = maxHeight;
            // Create the new image with the sizes we've calculated
            Image NewImage = FullSizeImage.GetThumbnailImage(newWidth, newHeight, null, IntPtr.Zero);
            FullSizeImage.Dispose();
            // NewImage.Save(newFileLocation);
            byte[] imageBytes;
            using (MemoryStream ms = new MemoryStream())
            {
                NewImage.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                imageBytes = ms.ToArray();
            }
            NewImage.Dispose();
            return imageBytes;
        }

        /// <summary>
        /// Thay đổi kích thước hình ảnh với chiều rộng và chiều cao mới và giữ tỷ lệ
        /// </summary>
        /// <param name="origFileLocation"></param>
        /// <param name="newFileLocation"></param>
        /// <param name="newFileName"></param>
        /// <param name="newWidth"></param>
        /// <param name="newHeight"></param>
        /// <param name="resizeIfWider"></param>
        public static byte[] ResizeImageAndRatio(string origFileLocation, int newWidth, int newHeight, bool resizeIfWider)
        {

            Image initImage = Image.FromFile(origFileLocation);
            int templateWidth = newWidth;
            int templateHeight = newHeight;
            decimal templateRate = decimal.Parse(templateWidth.ToString()) / templateHeight;
            decimal initRate = decimal.Parse(initImage.Width.ToString()) / initImage.Height;
            if (templateRate == initRate)
            {

                Image templateImage = new Bitmap(templateWidth, templateHeight);
                Graphics templateG = Graphics.FromImage(templateImage);
                templateG.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.High;
                templateG.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                templateG.Clear(Color.White);
                templateG.DrawImage(initImage, new Rectangle(0, 0, templateWidth, templateHeight), new Rectangle(0, 0, initImage.Width, initImage.Height), GraphicsUnit.Pixel);
                // templateImage.Save(newFileLocation, System.Drawing.Imaging.ImageFormat.Jpeg);
                byte[] imageBytes;
                using (MemoryStream ms = new MemoryStream())
                {
                    templateImage.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                    imageBytes = ms.ToArray();
                }
                templateG.Dispose();
                templateImage.Dispose();
                initImage.Dispose();

                return imageBytes;
            }
            else
            {

                Image pickedImage = null;
                Graphics pickedG = null;


                Rectangle fromR = new Rectangle(0, 0, 0, 0);
                Rectangle toR = new Rectangle(0, 0, 0, 0);


                if (templateRate > initRate)
                {

                    pickedImage = new Bitmap(initImage.Width, int.Parse(Math.Floor(initImage.Width / templateRate).ToString()));
                    pickedG = Graphics.FromImage(pickedImage);


                    fromR.X = 0;
                    fromR.Y = int.Parse(Math.Floor((initImage.Height - initImage.Width / templateRate) / 2).ToString());
                    fromR.Width = initImage.Width;
                    fromR.Height = int.Parse(Math.Floor(initImage.Width / templateRate).ToString());


                    toR.X = 0;
                    toR.Y = 0;
                    toR.Width = initImage.Width;
                    toR.Height = int.Parse(Math.Floor(initImage.Width / templateRate).ToString());
                }

                else
                {
                    pickedImage = new Bitmap(int.Parse(Math.Floor(initImage.Height * templateRate).ToString()), initImage.Height);
                    pickedG = Graphics.FromImage(pickedImage);

                    fromR.X = int.Parse(Math.Floor((initImage.Width - initImage.Height * templateRate) / 2).ToString());
                    fromR.Y = 0;
                    fromR.Width = int.Parse(Math.Floor(initImage.Height * templateRate).ToString());
                    fromR.Height = initImage.Height;

                    toR.X = 0;
                    toR.Y = 0;
                    toR.Width = int.Parse(Math.Floor(initImage.Height * templateRate).ToString());
                    toR.Height = initImage.Height;
                }


                pickedG.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                pickedG.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;


                pickedG.DrawImage(initImage, toR, fromR, GraphicsUnit.Pixel);


                Image templateImage = new Bitmap(templateWidth, templateHeight);
                Graphics templateG = Graphics.FromImage(templateImage);
                templateG.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.High;
                templateG.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                templateG.Clear(Color.White);
                templateG.DrawImage(pickedImage, new Rectangle(0, 0, templateWidth, templateHeight), new Rectangle(0, 0, pickedImage.Width, pickedImage.Height), GraphicsUnit.Pixel);
                // templateImage.Save(newFileLocation, System.Drawing.Imaging.ImageFormat.Jpeg);
                byte[] imageBytes;
                using (MemoryStream ms = new MemoryStream())
                {
                    templateImage.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                    imageBytes = ms.ToArray();
                }

                templateG.Dispose();
                templateImage.Dispose();

                pickedG.Dispose();
                pickedImage.Dispose();

                initImage.Dispose();
                return imageBytes;
            }
        }
    }
}
