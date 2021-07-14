/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.google.sample.cloudvision;

import android.Manifest;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.content.FileProvider;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckedTextView;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.api.client.extensions.android.http.AndroidHttp;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.vision.v1.Vision;
import com.google.api.services.vision.v1.VisionRequest;
import com.google.api.services.vision.v1.VisionRequestInitializer;
import com.google.api.services.vision.v1.model.AnnotateImageRequest;
import com.google.api.services.vision.v1.model.BatchAnnotateImagesRequest;
import com.google.api.services.vision.v1.model.BatchAnnotateImagesResponse;
import com.google.api.services.vision.v1.model.EntityAnnotation;
import com.google.api.services.vision.v1.model.Feature;
import com.google.api.services.vision.v1.model.Image;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.lang.ref.WeakReference;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;


public class MainActivity extends AppCompatActivity implements LocationListener{
    private static final String CLOUD_VISION_API_KEY = BuildConfig.API_KEY;
    public static final String FILE_NAME = "temp.jpg";
    private static final String ANDROID_CERT_HEADER = "X-Android-Cert";
    private static final String ANDROID_PACKAGE_HEADER = "X-Android-Package";
    public static final String locationTAG = "MainActivity";
    private static final int MAX_LABEL_RESULTS = 15;
    private static final int MAX_LANDMARK_RESULTS = 6;
    private static final int MAX_DIMENSION = 1200;


    private static final String TAG = MainActivity.class.getSimpleName();
    private static final int GALLERY_PERMISSIONS_REQUEST = 0;
    private static final int GALLERY_IMAGE_REQUEST = 1;
    public static final int CAMERA_PERMISSIONS_REQUEST = 2;
    public static final int CAMERA_IMAGE_REQUEST = 3;
    public final int ACCESS_COARSE_LOCATION_REQUEST = 4;
    private ImageView mMainImage;
    /**add*/
    private Button btnChooseLabel, btnUpload;
    private EditText editTitle, editX, editY, editZ, editDate, editLatitude, editLongitude, editKeyword, editDescription, editReference, editCompanion, editContributor;
    private Spinner spinnerCategory, spinnerPriority;

    private static ArrayList<String> totalLabel = new ArrayList<>(), totalLandmark = new ArrayList<>();
    private String xText = "", yText = "", zText = "";
    private final String category[] = {"古蹟", "歷史建築", "紀念建築", "考古遺址", "史蹟",
            "文化景觀", "自然景觀", "傳統表演藝術", "傳統工藝", "口述傳統", "民俗", "民俗及有關文物", "傳統知識與實踐",
            "一般景觀含建築:人工地景與自然地景", "植物", "動物", "生物", "食衣住行育樂", "其他"};
    private final String priority[] = {"1★", "2★", "3★", "4★", "5★"};
    private float orientation, orientation1;
    private static final String ROOT_URL = "http:/140.116.82.135:8000/photo_server/";
    private double longitude = 190.0, latitude = 100.0;
    private Bitmap pictureBitmap;
    private static ArrayList<Boolean> listShowLabel = new ArrayList<>(), listShowLandmark = new ArrayList<>();
    private int whatCategory, whatPriority;
    private Boolean getLongitude, getLatitude;

    SensorManager sm = null;
    private LocationManager locationManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        if(PermissionUtils.requestPermission(this,
                ACCESS_COARSE_LOCATION_REQUEST,
                Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_LOCATION_EXTRA_COMMANDS)){

        }

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        FloatingActionButton fab = findViewById(R.id.fab);
        fab.setOnClickListener(view -> {
            AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
            builder
                    .setMessage(R.string.dialog_select_prompt)
                    .setPositiveButton(R.string.dialog_select_gallery, (dialog, which) -> startGalleryChooser())
                    .setNegativeButton(R.string.dialog_select_camera, (dialog, which) -> startCamera());
            builder.create().show();
        });

        /**add*/
        findObject();
        setOnClickEvent();
        init();
        sm = (SensorManager) getSystemService(SENSOR_SERVICE);
        sm.registerListener(acc_listener, sm.getDefaultSensor(Sensor.TYPE_ORIENTATION),SensorManager.SENSOR_DELAY_NORMAL);

        locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                return;
            }
        }
        locationManager.requestLocationUpdates(locationManager.GPS_PROVIDER,0,0, (LocationListener) this);
        /**button of alertdialog*/
        btnChooseLabel.setVisibility(View.INVISIBLE);
        btnUpload.setVisibility(View.INVISIBLE);
    }

    private void findObject() {
        mMainImage = findViewById(R.id.main_image);
        editTitle = findViewById(R.id.edit_title);
        editDate = findViewById(R.id.edit_date);
        editX = findViewById(R.id.edit_X);
        editY = findViewById(R.id.edit_Y);
        editZ = findViewById(R.id.edit_Z);
        editLatitude = findViewById(R.id.edit_latitude);
        editLongitude = findViewById(R.id.edit_longitude);
        editKeyword = findViewById(R.id.edit_keyword);
        editDescription = findViewById(R.id.edit_description);
        editReference = findViewById(R.id.edit_reference);
        editCompanion = findViewById(R.id.edit_companion);
        editContributor = findViewById(R.id.edit_contributor);
        btnChooseLabel = findViewById(R.id.btn_chooseLabel);
        btnUpload = findViewById(R.id.btn_upload);
        spinnerCategory = (Spinner) findViewById(R.id.spinner_category);
        spinnerPriority = (Spinner) findViewById(R.id.spinner_priority);
    }

    private void setOnClickEvent() {
        btnChooseLabel.setOnClickListener(view -> {
            AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
            View view1 = getLayoutInflater().inflate(R.layout.label_choose_dialog,null);
            builder
                    .setMessage("Choose tag")
                    .setView(view1);
            AlertDialog alertDialog = builder.create();
            alertDialog.show();
            alertDialog.setCancelable(false);
            alertDialog.setCanceledOnTouchOutside(false);
            Button btn = view1.findViewById(R.id.ok);
            btn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    btnUpload.setVisibility(View.VISIBLE);
                    alertDialog.dismiss();
                }
            });
            for(int i = 0; i < listShowLabel.size(); ++i)
                listShowLabel.set(i, true);
            for(int i = 0; i < listShowLandmark.size(); ++i)
                listShowLandmark.set(i, true);
            ListView labelList = view1.findViewById(R.id.labelList);
            ListView landmarkList = view1.findViewById(R.id.landmarkList);
            labelList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                @Override
                public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                    CheckedTextView chkItem = (CheckedTextView) view.findViewById(R.id.check1);
                    chkItem.setChecked(!chkItem.isChecked());
                    listShowLabel.set(i, chkItem.isChecked());
                }
            });
            ListAdapter adapterItem = new MulAdapter(this, totalLabel);
            labelList.setAdapter(adapterItem);
            landmarkList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                @Override
                public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                    CheckedTextView chkItem = (CheckedTextView) view.findViewById(R.id.check1);
                    chkItem.setChecked(!chkItem.isChecked());
                    listShowLandmark.set(i, chkItem.isChecked());
                }
            });
            ListAdapter adapter = new LandmarkListAdapter(this, totalLandmark);
            landmarkList.setAdapter(adapter);
            /*
            this.landmarkListAdapter = new ArrayAdapter(this, android.R.layout.simple_list_item_1, totalLandmark);
            landmarkList.setAdapter(landmarkListAdapter);*/
        });

        btnUpload.setOnClickListener(view -> {
            uploadBitmap(pictureBitmap);
            Toast.makeText(MainActivity.this, "上傳完成", Toast.LENGTH_SHORT).show();
            JSONObject jsonObject = getJSONObject();
            btnUpload.setVisibility(View.INVISIBLE);
            uploadJson(jsonObject);
        });

        spinnerCategory.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                whatCategory = i;
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });

        spinnerPriority.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                whatPriority = i + 1;
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
    }

    private void init(){
        ArrayAdapter<String> categoryList = new ArrayAdapter<>(MainActivity.this, android.R.layout.simple_spinner_dropdown_item, category);
        spinnerCategory.setAdapter(categoryList);
        ArrayAdapter<String> priorityList = new ArrayAdapter<>(MainActivity.this, android.R.layout.simple_spinner_dropdown_item, priority);
        spinnerPriority.setAdapter(priorityList);
        whatCategory = 0;
        whatPriority = 1;
        getLongitude = false;
        getLatitude = false;
    }

    public void startGalleryChooser() {
        btnChooseLabel.setVisibility(View.INVISIBLE);
        btnUpload.setVisibility(View.INVISIBLE);
        getTagData();
        if (PermissionUtils.requestPermission(this, GALLERY_PERMISSIONS_REQUEST, Manifest.permission.READ_EXTERNAL_STORAGE)) {
            Intent intent = new Intent();
            intent.setType("image/*");
            intent.setAction(Intent.ACTION_GET_CONTENT);
            startActivityForResult(Intent.createChooser(intent, "Select a photo"),
                    GALLERY_IMAGE_REQUEST);
        }
    }

    public void startCamera() {
        btnChooseLabel.setVisibility(View.INVISIBLE);
        btnUpload.setVisibility(View.INVISIBLE);
        getTagData();
        if (PermissionUtils.requestPermission(
                this,
                CAMERA_PERMISSIONS_REQUEST,
                Manifest.permission.READ_EXTERNAL_STORAGE,
                Manifest.permission.CAMERA)) {
            Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            Uri photoUri = FileProvider.getUriForFile(this, getApplicationContext().getPackageName() + ".provider", getCameraFile());
            intent.putExtra(MediaStore.EXTRA_OUTPUT, photoUri);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            startActivityForResult(intent, CAMERA_IMAGE_REQUEST);
        }
    }

    public File getCameraFile() {
        File dir = getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        return new File(dir, FILE_NAME);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == GALLERY_IMAGE_REQUEST && resultCode == RESULT_OK && data != null) {
            uploadImage(data.getData());
        } else if (requestCode == CAMERA_IMAGE_REQUEST && resultCode == RESULT_OK) {
            Uri photoUri = FileProvider.getUriForFile(this, getApplicationContext().getPackageName() + ".provider", getCameraFile());
            uploadImage(photoUri);
        }
    }

    @Override
    public void onRequestPermissionsResult(
            int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case CAMERA_PERMISSIONS_REQUEST:
                if (PermissionUtils.permissionGranted(requestCode, CAMERA_PERMISSIONS_REQUEST, grantResults)) {
                    startCamera();
                }
                break;
            case GALLERY_PERMISSIONS_REQUEST:
                if (PermissionUtils.permissionGranted(requestCode, GALLERY_PERMISSIONS_REQUEST, grantResults)) {
                    startGalleryChooser();
                }
                break;
        }
    }

    public void uploadImage(Uri uri) {
        Toast.makeText(MainActivity.this, "正在分析，請稍後...", Toast.LENGTH_LONG).show();
        if (uri != null) {
            try {
                // scale the image to save on bandwidth
                Bitmap bitmap =
                        scaleBitmapDown(
                                MediaStore.Images.Media.getBitmap(getContentResolver(), uri),
                                MAX_DIMENSION);

                pictureBitmap = bitmap;
                callCloudVision(bitmap);
                mMainImage.setImageBitmap(bitmap);

            } catch (IOException e) {
                Log.d(TAG, "Image picking failed because " + e.getMessage());
                Toast.makeText(this, R.string.image_picker_error, Toast.LENGTH_LONG).show();
            }
        } else {
            Log.d(TAG, "Image picker gave us a null image.");
            Toast.makeText(this, R.string.image_picker_error, Toast.LENGTH_LONG).show();
        }
    }

    private Vision.Images.Annotate prepareAnnotationRequest(Bitmap bitmap) throws IOException {
        HttpTransport httpTransport = AndroidHttp.newCompatibleTransport();
        JsonFactory jsonFactory = GsonFactory.getDefaultInstance();

        VisionRequestInitializer requestInitializer =
                new VisionRequestInitializer(CLOUD_VISION_API_KEY) {
                    /**
                     * We override this so we can inject important identifying fields into the HTTP
                     * headers. This enables use of a restricted cloud platform API key.
                     */
                    @Override
                    protected void initializeVisionRequest(VisionRequest<?> visionRequest)
                            throws IOException {
                        super.initializeVisionRequest(visionRequest);

                        String packageName = getPackageName();
                        visionRequest.getRequestHeaders().set(ANDROID_PACKAGE_HEADER, packageName);

                        String sig = PackageManagerUtils.getSignature(getPackageManager(), packageName);

                        visionRequest.getRequestHeaders().set(ANDROID_CERT_HEADER, sig);
                    }
                };

        Vision.Builder builder = new Vision.Builder(httpTransport, jsonFactory, null);
        builder.setVisionRequestInitializer(requestInitializer);

        Vision vision = builder.build();

        BatchAnnotateImagesRequest batchAnnotateImagesRequest =
                new BatchAnnotateImagesRequest();
        batchAnnotateImagesRequest.setRequests(new ArrayList<AnnotateImageRequest>() {{
            AnnotateImageRequest annotateImageRequest = new AnnotateImageRequest();

            // Add the image
            Image base64EncodedImage = new Image();
            // Convert the bitmap to a JPEG
            // Just in case it's a format that Android understands but Cloud Vision
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.JPEG, 90, byteArrayOutputStream);
            byte[] imageBytes = byteArrayOutputStream.toByteArray();

            // Base64 encode the JPEG
            base64EncodedImage.encodeContent(imageBytes);
            annotateImageRequest.setImage(base64EncodedImage);

            // add the features we want
            annotateImageRequest.setFeatures(new ArrayList<Feature>() {{
                Feature labelDetection = new Feature();
                labelDetection.setType("LABEL_DETECTION");
                labelDetection.setMaxResults(MAX_LABEL_RESULTS);
                add(labelDetection);

                Feature landmarkDetection = new Feature();
                landmarkDetection.setType("LANDMARK_DETECTION");
                landmarkDetection.setMaxResults(MAX_LANDMARK_RESULTS);
                add(landmarkDetection);
            }});

            // Add the list of one thing to the request
            add(annotateImageRequest);
        }});

        Vision.Images.Annotate annotateRequest =
                vision.images().annotate(batchAnnotateImagesRequest);
        // Due to a bug: requests to Vision API containing large images fail when GZipped.
        annotateRequest.setDisableGZipContent(true);
        Log.d(TAG, "created Cloud Vision request object, sending request");

        return annotateRequest;
    }

    private static class LabelDetectionTask extends AsyncTask<Object, Void, String> {
        private final WeakReference<MainActivity> mActivityWeakReference;
        private Vision.Images.Annotate mRequest;

        LabelDetectionTask(MainActivity activity, Vision.Images.Annotate annotate) {
            mActivityWeakReference = new WeakReference<>(activity);
            mRequest = annotate;
        }

        @Override
        protected String doInBackground(Object... params) {
            try {
                Log.d(TAG, "created Cloud Vision request object, sending request");
                BatchAnnotateImagesResponse response = mRequest.execute();
                return convertResponseToString(response);

            } catch (GoogleJsonResponseException e) {
                Log.d(TAG, "failed to make API request because " + e.getContent());
            } catch (IOException e) {
                Log.d(TAG, "failed to make API request because of other IOException " +
                        e.getMessage());
            }
            return "Cloud Vision API request failed. Check logs for details.";
        }

        protected void onPostExecute(String result) {
            MainActivity activity = mActivityWeakReference.get();
            if (activity != null && !activity.isFinishing()) {
                Button button = activity.findViewById(R.id.btn_chooseLabel);
                button.setVisibility(View.VISIBLE);
            }
        }
    }

    private void callCloudVision(final Bitmap bitmap) {
        // Switch text to loading

        // Do the real work in an async task, because we need to use the network anyway
        try {
            AsyncTask<Object, Void, String> labelDetectionTask = new LabelDetectionTask(this, prepareAnnotationRequest(bitmap));
            labelDetectionTask.execute();
        } catch (IOException e) {
            Log.d(TAG, "failed to make API request because of other IOException " +
                    e.getMessage());
        }
    }

    private Bitmap scaleBitmapDown(Bitmap bitmap, int maxDimension) {

        int originalWidth = bitmap.getWidth();
        int originalHeight = bitmap.getHeight();
        int resizedWidth = maxDimension;
        int resizedHeight = maxDimension;

        if (originalHeight > originalWidth) {
            resizedHeight = maxDimension;
            resizedWidth = (int) (resizedHeight * (float) originalWidth / (float) originalHeight);
        } else if (originalWidth > originalHeight) {
            resizedWidth = maxDimension;
            resizedHeight = (int) (resizedWidth * (float) originalHeight / (float) originalWidth);
        } else if (originalHeight == originalWidth) {
            resizedHeight = maxDimension;
            resizedWidth = maxDimension;
        }
        return Bitmap.createScaledBitmap(bitmap, resizedWidth, resizedHeight, false);
    }

    private static String convertResponseToString(BatchAnnotateImagesResponse response) {
        StringBuilder message = new StringBuilder("I found these things:\n\n");

        List<EntityAnnotation> labels = response.getResponses().get(0).getLabelAnnotations();
        List<EntityAnnotation> landmarks = response.getResponses().get(0).getLandmarkAnnotations();
        totalLabel.clear();
        listShowLabel.clear();

        totalLandmark.clear();
        listShowLandmark.clear();
        if (labels != null) {
            for (EntityAnnotation label : labels) {
                totalLabel.add(String.format(Locale.US, "%.3f: %s", label.getScore(), label.getDescription()));
                listShowLabel.add(true);
                message.append(String.format(Locale.US, "%.3f: %s", label.getScore(), label.getDescription()));
                message.append("\n");
            }
            message.append("\n");
        }
        if(landmarks != null) {
            for (EntityAnnotation landmark : landmarks) {
                listShowLandmark.add(true);
                totalLandmark.add(String.format(Locale.US, "%.3f: %s", landmark.getScore(), landmark.getDescription()));
                message.append(String.format(Locale.US, "%.3f: %s", landmark.getScore(), landmark.getDescription()));
                message.append("\n");
            }
        }
        if(landmarks==null && labels==null) {
            message.append("nothing");
        }


        return message.toString();
    }

    private SensorEventListener acc_listener = new SensorEventListener() {
        //當sensor的準確性改變時會執行
        @Override
        public void onAccuracyChanged(Sensor sensor, int accuracy) {
            Log.d("Sensor_test","onAccuracyChanged: " + sensor + ", accuracy: " + accuracy);
        }
        //sensor座標變動時執行
        @Override
        public void onSensorChanged(SensorEvent event) {
            xText = Integer.toString((int)event.values[1]);
            yText = Integer.toString((int)event.values[2]);
            orientation = event.values[0];
            if(event.values[0]<11.25 || event.values[0] >= 348.75){
                zText = "北";
            }else if(event.values[0]<33.75){
                zText = "北北東";
            }else if(event.values[0]<56.25){
                zText = "東北";
            }else if(event.values[0]<78.75){
                zText = "東北東";
            }else if(event.values[0]<101.25){
                zText = "東";
            }else if(event.values[0]<123.75){
                zText = "東南東";
            }else if(event.values[0]<146.25){
                zText = "東南";
            }else if(event.values[0]<168.75){
                zText = "南南東";
            }else if(event.values[0]<191.25){
                zText = "南";
            }else if(event.values[0]<213.75){
                zText = "南南西";
            }else if(event.values[0]<236.25){
                zText = "西南";
            }else if(event.values[0]<258.75){
                zText = "西南西";
            }else if(event.values[0]<281.25){
                zText = "西";
            }else if(event.values[0]<303.75){
                zText = "西北西";
            }else if(event.values[0]<326.25){
                zText = "西北";
            }else if(event.values[0]<348.75){
                zText = "北北西";
            }
            //zViewA.setText("ORIENTATION_Z: " + event.values[0]);
            /*
             * value[0]：Z軸，Sensor方位，北：0、東：90、南：180、西：270
             * value[1]：X軸，Sensor傾斜度(抬起手機頂部，X軸的值會變動)
             * value[2]：Y軸，Sensor滾動角度(側邊翻轉)
             */
        }
    };

    public void onLocationChanged(Location location) {
        Log.i(locationTAG, "onLocationChanged - " + location.toString());
        longitude = (int)(location.getLongitude() * 1000000) / 1000000.0;
        latitude =  (int)(location.getLatitude() * 1000000) / 1000000.0;
    }

    @Override
    public void onStatusChanged(String s, int i, Bundle bundle) {
        Log.i(locationTAG, "onStatusChanged");
    }

    @Override
    public void onProviderEnabled(String s) {
        Log.i(locationTAG, "onProviderEnabled");
    }

    @Override
    public void onProviderDisabled(String s) {
        Log.i(locationTAG, "onProviderDisabled");
    }

    public void getTagData(){
        SimpleDateFormat sDateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        String date = sDateFormat.format(new java.util.Date());
        editDate.setText(date);
        editX.setText(xText);
        editY.setText(yText);
        editZ.setText(zText);
        orientation1 = orientation;
        if(longitude <= 180 && latitude <= 90) {
            editLongitude.setText(Double.toString(longitude));
            editLatitude.setText(Double.toString(latitude));
            getLatitude = true;
            getLongitude = true;
        }
        else{
            /*
            editLongitude.setText(Double.toString(longitude));
            editLatitude.setText(Double.toString(latitude));
            */
            editLongitude.setText("找不到GPS訊號");
            editLatitude.setText("找不到GPS訊號");
            getLatitude = false;
            getLongitude = false;
        }
    }

    private void uploadBitmap(final Bitmap bitmap) {

        VolleyMultipartRequest volleyMultipartRequest = new VolleyMultipartRequest(Request.Method.POST, ROOT_URL,
                new Response.Listener<NetworkResponse>() {
                    @Override
                    public void onResponse(NetworkResponse response) {
                        try {
                            JSONObject obj = new JSONObject(new String(response.data));
                            Toast.makeText(getApplicationContext(), obj.getString("message"), Toast.LENGTH_SHORT).show();
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(getApplicationContext(), error.getMessage(), Toast.LENGTH_LONG).show();
                        Log.e("GotError",""+error.getMessage());
                    }
                }) {


            @Override
            protected Map<String, DataPart> getByteData() {
                Map<String, DataPart> params = new HashMap<>();
                //long imagename = System.currentTimeMillis();
                String imageName = "photo";
                params.put("image", new DataPart(imageName + ".jpg", getFileDataFromDrawable(bitmap)));
                return params;
            }
        };

        //adding the request to volley
        Volley.newRequestQueue(this).add(volleyMultipartRequest);
    }

    public byte[] getFileDataFromDrawable(Bitmap bitmap) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 80, byteArrayOutputStream);
        return byteArrayOutputStream.toByteArray();
    }

    public JSONObject getJSONObject(){
        JSONObject jsonObject = new JSONObject();
        JSONObject vision_api = new JSONObject();
        try{
            if(!editTitle.getText().toString().matches(""))
                jsonObject.put("title", editTitle.getText().toString());
            else
                jsonObject.put("title", "NULL");
            if(!editDate.getText().toString().matches(""))
                jsonObject.put("date", editDate.getText().toString());
            else
                jsonObject.put("date", "NULL");
            if(!editLatitude.getText().toString().matches(""))
                if(getLatitude)
                    jsonObject.put("latitude", Float.parseFloat(editLatitude.getText().toString()));
                else
                    jsonObject.put("latitude", 0);
            else
                jsonObject.put("latitude", 0);
            jsonObject.put("altitude", 0);
            if(!editLongitude.getText().toString().matches(""))
                if(getLongitude)
                    jsonObject.put("longitude", Float.parseFloat(editLongitude.getText().toString()));
                else
                    jsonObject.put("longitude", 0);
            else
                jsonObject.put("longitude", 0);
            if(!editZ.getText().toString().matches(""))
                jsonObject.put("orientation", editZ.getText().toString());
            jsonObject.put("azimuth", orientation1);
            jsonObject.put("category", category[whatCategory]);
            if(!editKeyword.getText().toString().matches(""))
                jsonObject.put("keyword", editKeyword.getText().toString());
            else
                jsonObject.put("keyword", "NULL");
            if(!editDescription.getText().toString().matches(""))
                jsonObject.put("description", editDescription.getText().toString());
            else
                jsonObject.put("description", "NULL");
            if(!editReference.getText().toString().matches(""))
                jsonObject.put("reference", editReference.getText().toString());
            else
                jsonObject.put("reference", "NULL");
            if(!editCompanion.getText().toString().matches(""))
                jsonObject.put("companion", editCompanion.getText().toString());
            else
                jsonObject.put("companion", "NULL");
            jsonObject.put("priority", whatPriority);
            if(!editContributor.getText().toString().matches(""))
                jsonObject.put("contributor", editContributor.getText().toString());
            else
                jsonObject.put("contributor", "NULL");
            int num = 0;
            String value = "";
            for(int i = 0; i < totalLabel.size(); ++i){
                if(listShowLabel.get(i) == true){
                    String key = "label" + Integer.toString(num);
                    value = totalLabel.get(i).substring(7);
                    vision_api.put(key, value);
                    num ++;
                }
            }
            for(int i = 0; i < 31 - num; ++i){
                String key = "label" + Integer.toString(num + i);
                vision_api.put(key, "NULL");
            }
            num = 0;
            for(int i = 0; i < totalLandmark.size(); ++i){
                if(listShowLandmark.get(i) == true){
                    String key = "landmark" + Integer.toString(num);
                    vision_api.put(key, totalLandmark.get(i).substring(7));
                    num ++;
                }
            }
            for(int i = 0; i < 6 - num; ++i){
                String key = "landmark" + Integer.toString(num + i);
                vision_api.put(key, "NULL");
            }
            jsonObject.put("vision_api", vision_api);
        }catch (JSONException e){
            e.printStackTrace();
        }
        return jsonObject;
    }

    public void uploadJson(JSONObject object){
        final String test_url = "http://140.116.82.135:6868";
        RequestQueue requestQueue = Volley.newRequestQueue(MainActivity.this);

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, test_url, object,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {}
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
            }
        });

        requestQueue.add(jsonObjectRequest);
    }
}
