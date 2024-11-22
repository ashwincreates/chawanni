package com.chawanni

import android.content.Intent
import android.net.Uri
import android.app.Activity
import com.facebook.react.bridge.*
import android.util.Log


class UpiLauncher(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var currentPromise: Promise? = null

    private val activityListener = object: BaseActivityEventListener() {
        override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == REQUEST_CODE) {
            when (resultCode) {
                Activity.RESULT_OK -> {
                    val result = data?.data // Extract result data
                    currentPromise?.resolve(result)
                }
                Activity.RESULT_CANCELED -> {
                    currentPromise?.resolve("Activity was canceled by the user.")
                }
                else -> {
                    currentPromise?.reject("PAYMENT_ERROR", "Unknown result code: $resultCode")
                }
            }
            currentPromise = null
        }
    }}



    init {
        reactContext.addActivityEventListener(activityListener)
    }

    override fun getName(): String {
        return "UpiLauncher" // Module name
    }

    @ReactMethod
    fun openActivity(url: String, promise: Promise) {
        Log.d("UpiModule", "Activating Intent")
        currentPromise = promise
        Log.d("UpiModule", "Created Promise")

        val activity = currentActivity
        if (activity == null) {
            Log.d("UpiModule", "Activity is null")
            promise.reject("Error", "Activity doesn't exist")
            return
        }
        Log.d("UpiModule", "Starting Intent")
        try {
            val intent = Intent(Intent.ACTION_VIEW).apply {
                data = Uri.parse(url)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK // Required to launch activity from a non-Activity context
            }
            activity.startActivityForResult(intent, REQUEST_CODE)
        } catch (e: Exception) {
            Log.d("UpiModule", "Error occurred")
            promise.reject("Error", e.message)
            currentPromise = null
        }
    }

    companion object {
        private const val REQUEST_CODE = 100 // Unique request code for identifying the result
    }
}