import UIKit
import CoreLocation
import MapKit
import Alamofire
import SwiftyJSON
//#import "DEH-Bridging-Header.h";

public var label_labels: Array<String> = []
public var label_bool: Array<Bool> = []
public var landmark_labels: Array<String> = []
public var landmark_bool: Array<Bool> = []


class ViewController: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate, CLLocationManagerDelegate, MKMapViewDelegate {
    
    var checkDONE : Bool = false
    
    @IBOutlet var mainView: UIView!
    var fullsize :CGSize!
    var image_bottom : Int!
    @IBOutlet weak var si_text: UILabel!
    @IBOutlet weak var ti_text: UILabel!
    @IBOutlet weak var la_text: UILabel!
    @IBOutlet weak var long_text: UILabel!
    @IBOutlet weak var al_text: UILabel!
    @IBOutlet weak var da_text: UILabel!
    @IBOutlet weak var ori_text: UILabel!
    @IBOutlet weak var cat_text: UILabel!
    @IBOutlet weak var keyw_text: UILabel!
    @IBOutlet weak var des_text: UILabel!
    @IBOutlet weak var refe_text: UILabel!
    @IBOutlet weak var contri_text: UILabel!
    @IBOutlet weak var com_text: UILabel!
    @IBOutlet weak var pri_text: UILabel!
    @IBOutlet weak var scrollView: UIScrollView!
    
    @IBOutlet weak var latitude: UILabel!
    @IBOutlet weak var longtitude: UILabel!
    @IBOutlet weak var altitude: UILabel!
    @IBOutlet weak var date: UILabel!
    @IBOutlet weak var orientation: UILabel!
        
    @IBOutlet weak var allTags: UIView!
    
    @IBOutlet weak var Choose_Label: UIButton!
    @IBOutlet weak var done_but: UIButton!
    
    var image: UIImage!
    var imageView1: UIImageView!
    
    let locationManager = CLLocationManager()
    var photo_location: [Double] = [0.0, 0.0, 0.0]
    var photo_date: String = ""
    var photo_orient: Double = 0.0
    var positionValue:String = ""
    var photo_location_temp: [Double] = [0.0, 0.0, 0.0]
    var photo_date_temp: String = ""
    var photo_orient_temp: Double = 0.0
    var positionValue_temp:String = ""
    
    var Category = ["ALL", "古蹟", "歷史建築", "紀念建築", "考古遺址", "史蹟", "文化景觀", "自然景觀", "傳統表演藝術", "傳統工藝", "口述傳統", "民俗", "民俗及有關文物", "傳統知識與實踐", "一般景觀含建築：人工地景與自然地景", "植物", "動物", "生物", "食衣住行育樂", "其他"]
    var Priority = ["⭐️", "⭐️⭐️", "⭐️⭐️⭐️", "⭐️⭐️⭐️⭐️", "⭐️⭐️⭐️⭐️⭐️"]
    var star_count = -1
    
    var imageView: UIImageView!
    
    let imagePicker = UIImagePickerController()
    let session = URLSession.shared
    
    @IBOutlet weak var wait: UIActivityIndicatorView!
    
    
    var googleAPIKey = "**********"
    var googleURL: URL {
        return URL(string: "https://vision.googleapis.com/v1/images:annotate?key=\(googleAPIKey)")!
    }
    
    @IBOutlet weak var title_text: UITextField!
    @IBOutlet weak var keyword_text: UITextField!
    @IBOutlet weak var description_text: UITextField!
    @IBOutlet weak var reference_text: UITextField!
    @IBOutlet weak var contributor_text: UITextField!
    @IBOutlet weak var companion_text: UITextField!
    @IBOutlet weak var Cate_text: UITextField!
    @IBOutlet weak var priority_text: UITextField!
    var picker = UIPickerView()
    var picker_p = UIPickerView()

    override func viewDidLoad() {
           
        super.viewDidLoad()
        
        fullsize = UIScreen.main.bounds.size
        image_bottom = Int(40 + fullsize.width - 20 + 10)
        scrollView?.frame = CGRect(x: 0, y: 50, width: fullsize.width, height: fullsize.height - 169)
        scrollView?.contentSize = CGSize(width: 0, height: image_bottom+(29+8)*12-3+35+50)
        scrollView?.backgroundColor = UIColor.white
        //allTags.frame = CGRect(x: 0, y: 50, width: fullsize.width, height: image_bottom+(29+8)*12-3+34+50)
        
        si_text?.frame = CGRect(x: 20, y: 5, width: 122, height: 29)
        ti_text?.frame = CGRect(x: 20, y: image_bottom, width: 109, height: 29)
        la_text?.frame = CGRect(x: 20, y: image_bottom+29+8, width: 109, height: 29)
        long_text?.frame = CGRect(x: 20, y: image_bottom+29*2+8*2, width: 109, height: 29)
        al_text?.frame = CGRect(x: 20, y: image_bottom+29*3+8*3, width: 109, height: 29)
        da_text?.frame = CGRect(x: 20, y: image_bottom+29*4+8*4, width: 109, height: 29)
        ori_text?.frame = CGRect(x: 20, y: image_bottom+29*5+8*5, width: 109, height: 29)
        cat_text?.frame = CGRect(x: 20, y: image_bottom+29*6+8*6, width: 109, height: 29)
        keyw_text?.frame = CGRect(x: 20, y: image_bottom+29*7+8*7, width: 109, height: 29)
        des_text?.frame = CGRect(x: 20, y: image_bottom+29*8+8*8, width: 109, height: 29)
        refe_text?.frame = CGRect(x: 20, y: image_bottom+29*9+8*9, width: 109, height: 29)
        com_text?.frame = CGRect(x: 20, y: image_bottom+29*10+8*10, width: 109, height: 29)
        pri_text?.frame = CGRect(x: 20, y: image_bottom+29*11+8*11, width: 109, height: 29)
        contri_text?.frame = CGRect(x: 20, y: image_bottom+29*12+8*12, width: 109, height: 29)
        
        title_text?.frame = CGRect(x: 135, y: CGFloat(image_bottom-3), width: fullsize.width-145, height: 34)
        latitude?.frame = CGRect(x: 135, y: CGFloat(image_bottom+29+8+4-6), width: fullsize.width-145, height: 34)
        longtitude?.frame = CGRect(x: 135, y: CGFloat(image_bottom+(29+8)*2+4-6), width: fullsize.width-145, height: 34)
        altitude?.frame = CGRect(x: 135, y: CGFloat(image_bottom+(29+8)*3+4-6), width: fullsize.width-145, height: 34)
        date?.frame = CGRect(x: 135, y: CGFloat(image_bottom+(29+8)*4+4-6), width: fullsize.width-145, height: 34)
        orientation?.frame = CGRect(x: 135, y: CGFloat(image_bottom+(29+8)*5+4-6), width: fullsize.width-145, height: 34)
        
        Cate_text?.frame = CGRect(x: 135, y: CGFloat(image_bottom+(29+8)*6-3), width: fullsize.width-145, height: 34)
        keyword_text?.frame = CGRect(x: 135, y: CGFloat(image_bottom+(29+8)*7-3), width: fullsize.width-145, height: 34)
        description_text?.frame = CGRect(x: 135, y: CGFloat(image_bottom+(29+8)*8-3), width: fullsize.width-145, height: 34)
        reference_text?.frame = CGRect(x: 135, y: CGFloat(image_bottom+(29+8)*9-3), width: fullsize.width-145, height: 34)
        companion_text?.frame = CGRect(x: 135, y: CGFloat(image_bottom+(29+8)*10-3), width: fullsize.width-145, height: 34)
        priority_text?.frame = CGRect(x: 135, y: CGFloat(image_bottom+(29+8)*11-3), width: fullsize.width-145, height: 34)
        contributor_text?.frame = CGRect(x: 135, y: CGFloat(image_bottom+(29+8)*12-3), width: fullsize.width-145, height: 34)
        Choose_Label?.frame = CGRect(x: Int(fullsize.width / 8 - 20), y: image_bottom+(29+8)*12-3+50, width: 158, height: 31)
        done_but?.frame = CGRect(x: Int(fullsize.width / 8 * 6 - 80), y: image_bottom+(29+8)*12-3+50, width: 158, height: 31)
        
        title_text?.attributedPlaceholder = NSAttributedString(string:"請輸入照片主題",  attributes: [NSAttributedString.Key.foregroundColor:UIColor.lightGray])
        keyword_text?.attributedPlaceholder = NSAttributedString(string:"請輸入照片關鍵字",  attributes: [NSAttributedString.Key.foregroundColor:UIColor.lightGray])
        description_text?.attributedPlaceholder = NSAttributedString(string:"請輸入照片描述",  attributes: [NSAttributedString.Key.foregroundColor:UIColor.lightGray])
        reference_text?.attributedPlaceholder = NSAttributedString(string:"請輸入參考資料",  attributes: [NSAttributedString.Key.foregroundColor:UIColor.lightGray])
        contributor_text?.attributedPlaceholder = NSAttributedString(string:"拍照者",  attributes: [NSAttributedString.Key.foregroundColor:UIColor.lightGray])
        companion_text?.attributedPlaceholder = NSAttributedString(string:"誰跟你一起來",  attributes: [NSAttributedString.Key.foregroundColor:UIColor.lightGray])
        Cate_text?.attributedPlaceholder = NSAttributedString(string:"ALL",  attributes: [NSAttributedString.Key.foregroundColor:UIColor.lightGray])
        priority_text?.attributedPlaceholder = NSAttributedString(string:"喜好程度",  attributes: [NSAttributedString.Key.foregroundColor:UIColor.lightGray])
        
        title_text?.layer.borderColor = UIColor.black.cgColor
        title_text?.layer.borderWidth = 2
        keyword_text?.layer.borderColor = UIColor.black.cgColor
        keyword_text?.layer.borderWidth = 2
        description_text?.layer.borderColor = UIColor.black.cgColor
        description_text?.layer.borderWidth = 2
        reference_text?.layer.borderColor = UIColor.black.cgColor
        reference_text?.layer.borderWidth = 2
        contributor_text?.layer.borderColor = UIColor.black.cgColor
        contributor_text?.layer.borderWidth = 2
        companion_text?.layer.borderColor = UIColor.black.cgColor
        companion_text?.layer.borderWidth = 2
        Cate_text?.layer.borderColor = UIColor.black.cgColor
        Cate_text?.layer.borderWidth = 2
        priority_text?.layer.borderColor = UIColor.black.cgColor
        priority_text?.layer.borderWidth = 2
        latitude?.layer.borderColor = UIColor.black.cgColor
        latitude?.layer.borderWidth = 2
        longtitude?.layer.borderColor = UIColor.black.cgColor
        longtitude?.layer.borderWidth = 2
        altitude?.layer.borderColor = UIColor.black.cgColor
        altitude?.layer.borderWidth = 2
        date?.layer.borderColor = UIColor.black.cgColor
        date?.layer.borderWidth = 2
        orientation?.layer.borderColor = UIColor.black.cgColor
        orientation?.layer.borderWidth = 2
        
        mainView?.bringSubviewToFront(self.wait)
        mainView?.backgroundColor = UIColor.white
        wait?.frame = CGRect(x: Int(fullsize.width) / 2 - 20, y: Int(fullsize.height) / 2 - 20, width: 40, height: 40)
        wait?.stopAnimating()
        wait?.hidesWhenStopped = true
        
        picker.dataSource = self
        picker.delegate = self
        picker_p.dataSource = self
        picker_p.delegate = self
        picker.tag = 1
        picker_p.tag = 2
        
        Cate_text?.inputView = picker
        priority_text?.inputView = picker_p
                
        let tap = UITapGestureRecognizer(target: self, action: #selector(closeKeyboard))
        view.addGestureRecognizer(tap)
        
                //TODO:Set up the location manager here.
                locationManager.delegate = self  //宣告自己 (current VC)為 locationManager 的代理
                locationManager.desiredAccuracy = kCLLocationAccuracyHundredMeters //定位所在地的精確程度(一般來說，精準程度越高，定位時間越長，所耗費的電力也因此更多)
                //to ask the user for location
                locationManager.requestWhenInUseAuthorization()  //for not destroying the user's battery
                locationManager.startUpdatingLocation() //this method will start navigating the location. And once this is done, it will send a msg to this ViewController
                locationManager.startUpdatingHeading()
        
        self.view.backgroundColor = UIColor.white
        
        // 生成圖片顯示框
        self.imageView = UIImageView()
        self.imageView.frame = CGRect(x: self.view.frame.size.width / 4 / 2, y: 64, width: self.view.frame.size.width / 4 * 3, height: self.view.frame.size.height / 4 * 2)
        self.imageView.image = UIImage(named: "profile")
        
        // 生成相機按鈕
        let cameraBtn: UIButton = UIButton()
        cameraBtn.frame = CGRect(x: self.view.frame.size.width / 8, y: fullsize.height - 100, width: 100, height: 100)
        cameraBtn.titleLabel?.font = UIFont.boldSystemFont(ofSize: 30)
        //cameraBtn.setTitle("相機", for: .normal)
        cameraBtn.setImage(UIImage(named: "camera.jpg"), for: .normal)
        //cameraBtn.setTitleColor(UIColor.white, for: .normal)
        cameraBtn.layer.cornerRadius = 10
        cameraBtn.backgroundColor = UIColor.darkGray
        cameraBtn.addTarget(self, action: #selector(ViewController.onCameraBtnAction(_:)), for: UIControl.Event.touchUpInside)
        
        // 生成相簿按鈕
        let photoBtn: UIButton = UIButton()
        photoBtn.frame = CGRect(x: self.view.frame.size.width / 8 * 7 - 100, y: fullsize.height - 100, width: 100, height: 100)
        photoBtn.titleLabel?.font = UIFont.boldSystemFont(ofSize: 30)
        //photoBtn.setTitle("相簿", for: .normal)
        photoBtn.setImage(UIImage(named: "album.png"), for: .normal)
        //photoBtn.setTitleColor(UIColor.white, for: .normal)
        photoBtn.layer.cornerRadius = 10
        photoBtn.backgroundColor = UIColor.darkGray
        photoBtn.addTarget(self, action: #selector(ViewController.onPhotoBtnAction(_:)), for: UIControl.Event.touchUpInside)
        
        self.view.addSubview(self.imageView)
        self.view.addSubview(cameraBtn)
        self.view.addSubview(photoBtn)
    }
    
    /// 開啟相機或相簿
    ///
    /// - Parameter kind: 1=相機,2=相簿
    func callGetPhoneWithKind(_ kind: Int) {
        let picker: UIImagePickerController = UIImagePickerController()
        switch kind {
        case 1:
            // 開啟相機
            if UIImagePickerController.isSourceTypeAvailable(UIImagePickerController.SourceType.camera) {
                picker.sourceType = UIImagePickerController.SourceType.camera
                picker.allowsEditing = true // 可對照片作編輯
                picker.delegate = self
                self.present(picker, animated: true, completion: nil)
            } else {
                print("沒有相機鏡頭...") // 用alertView.show
            }
        default:
            // 開啟相簿
            if UIImagePickerController.isSourceTypeAvailable(UIImagePickerController.SourceType.photoLibrary) {
                picker.sourceType = UIImagePickerController.SourceType.photoLibrary
                picker.allowsEditing = true // 可對照片作編輯
                picker.delegate = self
                self.present(picker, animated: true, completion: nil)
            }
        }
    }
        
    func analyzeResults(_ dataToParse: Data) {
        
        // Update UI on the main thread
            // Use SwiftyJSON to parse results
        do{
            let json = try JSON(data: dataToParse)
            let errorObj: JSON = json["error"]
            
            /*self.spinner.stopAnimating()
            self.imageView.isHidden = true
            self.labelResults.isHidden = false*/
            
            // Check for errors
            if (errorObj.dictionaryValue != [:]) {
                print("Error code \(errorObj["code"]): \(errorObj["message"])")
            } else {
                // Parse the response
                print(json)
                let responses: JSON = json["responses"][0]
                
                let labelAnnotations: JSON = responses["labelAnnotations"]
                let numLabels: Int = labelAnnotations.count
                var labels: Array<String> = []
                if numLabels > 0 {
                    var labelResultsText:String = "Labels found: "
                    for index in 0..<numLabels {
                        let label = labelAnnotations[index]["description"].stringValue
                        labels.append(label)
                        label_labels.append(label)
                        label_bool.append(true)
                    }
                    for label in labels {
                        // if it's not the last item add a comma
                        if labels[labels.count - 1] != label {
                            labelResultsText += "\(label), "
                        } else {
                            labelResultsText += "\(label)"
                        }
                    }
                    print(labelResultsText)
                } else {
                    print("No labels found")
                }
                
                let landmarkAnnotations: JSON = responses["landmarkAnnotations"]
                let numLandmarks: Int = landmarkAnnotations.count
                labels = []
                if numLandmarks > 0 {
                    var landmarkResultsText:String = "Landmarks found: "
                    for index in 0..<numLandmarks {
                        let label = landmarkAnnotations[index]["description"].stringValue
                        labels.append(label)
                        landmark_labels.append(label)
                        landmark_bool.append(true)
                    }
                    for label in labels {
                        // if it's not the last item add a comma
                        if labels[labels.count - 1] != label {
                            landmarkResultsText += "\(label), "
                        } else {
                            landmarkResultsText += "\(label)"
                        }
                    }
                    print(landmarkResultsText)
                } else {
                    print("No Landmarks found")
                }
            }
        }
        catch {
            print("error")
        }
    }
    
    func resizeImage(_ imageSize: CGSize, image: UIImage) -> Data {
        UIGraphicsBeginImageContext(imageSize)
        image.draw(in: CGRect(x: 0, y: 0, width: imageSize.width, height: imageSize.height))
        let newImage = UIGraphicsGetImageFromCurrentImageContext()
        let resizedImage = newImage!.pngData()
        UIGraphicsEndImageContext()
        return resizedImage!
    }
    
    func base64EncodeImage(_ image: UIImage) -> String {
        var imagedata = image.pngData()
        
        // Resize the image if it exceeds the 2MB API limit
        if (imagedata?.count > 2097152) {
            let oldSize: CGSize = image.size
            let newSize: CGSize = CGSize(width: 800, height: oldSize.height / oldSize.width * 800)
            imagedata = resizeImage(newSize, image: image)
        }
        
        return imagedata!.base64EncodedString(options: .endLineWithCarriageReturn)
    }
    
    func createRequest(with imageBase64: String) {
        // Create our request URL
        
        
        // Run the request on a background thread
        //DispatchQueue.global().async { self.runRequestOnBackgroundThread(request) }
    }
    
    // MARK: - CallBack & listener
    // ---------------------------------------------------------------------
    // 相機
    var pui = 0
    @objc func onCameraBtnAction(_ sender: UIButton) {
        pui = 1
        self.callGetPhoneWithKind(1)
    }
    
    // 相簿
    @objc func onPhotoBtnAction(_ sender: UIButton) {
        pui = 2
        self.callGetPhoneWithKind(2)
    }
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        checkDONE = true
        /*
        photo_location_temp = [0.0, 0.0, 0.0]
        photo_date_temp = ""
        photo_orient_temp = 0.0
        positionValue_temp = ""
        star_count = -1
        title_text.text = ""
        keyword_text.text = ""
        description_text.text = ""
        reference_text.text = ""
        companion_text.text = ""
        Cate_text.text = ""
        priority_text.text = ""
         */
        label_labels.removeAll()
        label_bool.removeAll()
        landmark_labels.removeAll()
        landmark_bool.removeAll()
        /*
        latitude.text = ""
        longtitude.text = ""
        altitude.text = ""
        date.text = ""
        orientation.text = ""
        */
        if(imageView1 != nil) {
            imageView1.removeFromSuperview()
        }
        
        image = info[UIImagePickerController.InfoKey.originalImage] as? UIImage
        if(image != nil) {
            if(pui == 1) {
                UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil)
            }
            
            imageView1 = UIImageView(image: image)
            imageView1.frame = CGRect(x: 20, y :40, width :fullsize.width - 40, height :fullsize.width - 40)
            allTags.addSubview(imageView1)
            
            photo_location_temp[0] = photo_location[0]
            photo_location_temp[1] = photo_location[1]
            photo_location_temp[2] = photo_location[2]
            photo_date_temp = photo_date
            photo_orient_temp = photo_orient
            positionValue_temp = positionValue
            
            
            print("latitude: \(photo_location[0])\n", "longtitude: \(photo_location[1])\n", "altitude: \(photo_location[2])\n", "date: \(photo_date)\n", "orientation: \(positionValue) \(photo_orient)\n")
            

                //latitude.textColor = UIColor.r
            latitude.text = String(format: "%.5f", photo_location_temp[0])
                //longtitude.textColor = UIColor.red
                longtitude.text = String(format: "%.5f", photo_location_temp[1])
                //altitude.textColor = UIColor.red
                altitude.text = String(format: "%.5f", photo_location_temp[2])
                //date.textColor = UIColor.red
                date.text = String(photo_date_temp)
                //orientation.textColor = UIColor.red
                orientation.text = "\(positionValue_temp) " + String(format: "%.5f", photo_orient_temp)
      
            let imageBase64 = base64EncodeImage(image)
            
            var request = URLRequest(url: googleURL)
            request.httpMethod = "POST"
            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
            request.addValue(Bundle.main.bundleIdentifier ?? "", forHTTPHeaderField: "X-Ios-Bundle-Identifier")
            
            // Build our API request
            let jsonRequest = [
                "requests": [
                    "image": [
                        "content": imageBase64
                    ],
                    "features": [
                        [
                            "type": "LABEL_DETECTION",
                            "maxResults": 31
                        ],
                        [
                            "type": "LANDMARK_DETECTION",
                            "maxResults": 6
                        ]
                    ]
                ]
            ]
            let jsonObject = JSON(jsonRequest)
            
            // Serialize the JSON
            guard let data = try? jsonObject.rawData() else {
                return
            }
            
            request.httpBody = data
            
            let task: URLSessionDataTask = session.dataTask(with: request) { (data, response, error) in
                guard let data = data, error == nil else {
                    print(error?.localizedDescription ?? "")
                    return
                }
                
                self.analyzeResults(data)
            }
            
            task.resume()
            
        }
        
        dismiss(animated: true, completion: nil)
    }
    
    @objc func closeKeyboard() {
        self.view.endEditing(true)
    }
    
    
    @IBAction func done(_ sender: Any) {
        if(checkDONE == false) {
            return
        }
        
        var vision_json: [String : Any] = [:]
        for i in 0...30{
            vision_json["label" + String(i)] = "NULL"
        }
        for i in 0...5{
            vision_json["landmark" + String(i)] = "NULL"
        }
        if(label_labels.count != 0) {
            for i in 0...label_labels.count - 1 {
                if(label_bool[i]) {
                    vision_json["label" + String(i)] = label_labels[i]
                }
            }
        }
        if(landmark_labels.count != 0) {
            for i in 0...landmark_labels.count - 1 {
                if(landmark_bool[i]) {
                    vision_json["landmark" + String(i)] = landmark_labels[i]
                }
            }
        }
        
        var ti = (title_text.text == "") ? "NULL" : title_text.text
        var cat = (Cate_text.text == "") ? "ALL" : Cate_text.text
        var k = (keyword_text.text == "") ? "NULL" : keyword_text.text
        var d = (description_text.text == "") ? "NULL" : description_text.text
        var ref = (reference_text.text == "") ? "NULL" : reference_text.text
        var c = (companion_text.text == "") ? "NULL" : companion_text.text
        var p = (priority_text.text == "") ? 1 : star_count + 1
        var contri = (contributor_text.text == "") ? "NULL" : contributor_text.text
        
        
        var send_json: [String : Any] =
                    ["title" : ti,
                     "date" : photo_date_temp,
                     "latitude" : photo_location_temp[0],
                     "longitude" : photo_location_temp[1],
                     "altitude" : photo_location_temp[2],
                     "orientation" : positionValue_temp,
                     "azimuth" : photo_orient_temp,
                     //"weather" : "sunny",   //un
                     //"address" : "NULL",        //un
                     //"era" : "NULL",            //un
                     "category" : cat,
                     "keyword" : k,
                     "description" : d,
                     "reference" : ref,
                     "companion" : c,
                     "priority" : p,
                     "contributor" : contri,
                     "vision_api" : vision_json
                    ]
        wait.startAnimating()
        AF.request("http://140.116.82.135:6868", method: .post, parameters: send_json, encoding: JSONEncoding.default, headers: nil).responseString{
            
            response in
            switch response.result{
            case .success:
                print(response)
                
                AF.upload(multipartFormData: { (data) in
                    data.append(self.image.jpegData(compressionQuality: 1)!, withName: "image_file", fileName: "photo.jpg", mimeType: "image/jpeg")
                            
                },to: "http://140.116.82.135:8000/photo_server/")
                .response{resp in print(resp)}
                
                self.wait.stopAnimating()
                self.wait.hidesWhenStopped = true
                /*
                self.photo_location_temp = [0.0, 0.0, 0.0]
                self.photo_date_temp = ""
                self.photo_orient_temp = 0.0
                self.positionValue_temp = ""
                self.star_count = -1
                self.title_text.text = ""
                self.keyword_text.text = ""
                self.description_text.text = ""
                self.reference_text.text = ""
                self.companion_text.text = ""
                self.Cate_text.text = ""
                self.priority_text.text = ""
                */
                label_labels.removeAll()
                label_bool.removeAll()
                landmark_labels.removeAll()
                landmark_bool.removeAll()
                /*
                self.latitude.text = ""
                self.longtitude.text = ""
                self.altitude.text = ""
                self.date.text = ""
                self.orientation.text = ""
                */
                self.imageView1.removeFromSuperview()
                self.checkDONE = false
                
                let controller = UIAlertController(title: "完成", message: "傳輸成功", preferredStyle: .alert)
                let okAction = UIAlertAction(title: "OK", style: .default, handler: nil)
                controller.addAction(okAction)
                self.present(controller, animated: true, completion: nil)
                
                break
            case .failure(let error):
                self.wait.stopAnimating()
                self.wait.hidesWhenStopped = true
                
                print(Error.self)
                
                let controller = UIAlertController(title: "Oops ! 發生錯誤", message: "傳輸失敗，請稍後再試", preferredStyle: .alert)
                let okAction = UIAlertAction(title: "OK", style: .default, handler: nil)
                controller.addAction(okAction)
                self.present(controller, animated: true, completion: nil)

                break
            }
        }
        
        
    }
    
    // MARK: - Delegate
    // ---------------------------------------------------------------------
    /// 取得選取後的照片
    ///
    /// - Parameters:
    ///   - picker: pivker
    ///   - info: info
    private func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        picker.dismiss(animated: true, completion: nil) // 關掉
        self.imageView.image = info[UIImagePickerController.InfoKey.originalImage.rawValue] as? UIImage // 從Dictionary取出原始圖檔
    }
    
    // 圖片picker控制器任務結束回呼
    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        picker.dismiss(animated: true, completion: nil)
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
    //由於我們的 "startUpdatingLocation()" 會回傳一個陣列的 CLLocation ，而最後回傳的會是最接近於我們當前位置的 CLLocation 。 因此我們要娶的就是這個 CLLocation
        let location = locations[locations.count - 1]  //the method "startUpdatingLocation()" is gonna grab a set of locations that are getting more & more accurate. So we'd want the last location in this array
        //簡單檢查一下取得的值
         if location.horizontalAccuracy > 0 {  //this line will check if the location is available
         // 由於定位功能十分耗電，我們既然已經取得了位置，就該速速把它關掉
           //locationManager.stopUpdatingLocation()
            photo_location[0]=location.coordinate.latitude
            photo_location[1]=location.coordinate.longitude
            photo_location[2]=location.altitude
            photo_date=(location.timestamp + 8*60*60).description[0...18]
            //photo_date=location.timestamp.description(with: .current)
            //print(type(of: location.timestamp))
            }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateHeading orientation: CLHeading ) {
        
        photo_orient = orientation.magneticHeading
        
        if(photo_orient >= 348.75 && photo_orient < 11.25){
            positionValue = "北"
        }else if(photo_orient >= 11.25 && photo_orient < 33.75){
            positionValue = "北北東"
        }else if(photo_orient >= 33.75 && photo_orient < 56.25){
            positionValue = "東北"
        }else if(photo_orient >= 56.25 && photo_orient < 78.75){
            positionValue = "東北東"
        }else if(photo_orient >= 78.75 && photo_orient < 101.25){
            positionValue = "東"
        }else if(photo_orient >= 101.25 && photo_orient < 123.75){
            positionValue = "東南東"
        }else if(photo_orient >= 123.75 && photo_orient < 146.25){
            positionValue = "東南"
        }else if(photo_orient >= 146.25 && photo_orient < 168.75){
            positionValue = "南南東"
        }else if(photo_orient >= 168.75 && photo_orient < 191.25){
            positionValue = "南"
        }else if(photo_orient >= 191.25 && photo_orient < 213.75){
            positionValue = "南南西"
        }else if(photo_orient >= 213.75 && photo_orient < 236.25){
            positionValue = "西南"
        }else if(photo_orient >= 236.25 && photo_orient < 258.75){
            positionValue = "西南西"
        }else if(photo_orient >= 258.75 && photo_orient < 281.25){
            positionValue = "西"
        }else if(photo_orient >= 281.25 && photo_orient < 303.75){
            positionValue = "西北西"
        }else if(photo_orient >= 303.75 && photo_orient < 326.25){
            positionValue = "西北"
        }else if(photo_orient >= 326.25 && photo_orient < 348.75){
            positionValue = "北北西"
        }
    }
}

extension ViewController : UIPickerViewDataSource {
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }
    
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        if(pickerView.tag == 1){
            return Category.count
        }
        else{
            return Priority.count
        }
    }
}

extension ViewController : UIPickerViewDelegate {
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        if(pickerView.tag == 1){
            return Category[row]
        }
        else{
            return Priority[row]
        }
    }
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        if(pickerView.tag == 1){
            Cate_text.text = Category[row]
        }
        else{
            priority_text.text = Priority[row]
            star_count = row
        }
    }
}

extension String {
    subscript (bounds: CountableClosedRange<Int>) -> String {
        let start = index(startIndex, offsetBy: bounds.lowerBound)
        let end = index(startIndex, offsetBy: bounds.upperBound)
        return String(self[start...end])
    }

    subscript (bounds: CountableRange<Int>) -> String {
        let start = index(startIndex, offsetBy: bounds.lowerBound)
        let end = index(startIndex, offsetBy: bounds.upperBound)
        return String(self[start..<end])
    }
}

fileprivate func > <T : Comparable>(lhs: T?, rhs: T?) -> Bool {
    switch (lhs, rhs) {
    case let (l?, r?):
        return l > r
    default:
        return rhs! < lhs!
    }
}
