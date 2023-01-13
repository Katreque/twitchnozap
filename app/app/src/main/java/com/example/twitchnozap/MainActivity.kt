package com.example.twitchnozap

import android.os.Bundle
import android.view.LayoutInflater
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import com.example.twitchnozap.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(LayoutInflater.from(this))
        setContentView(binding.root)
        binding.recyclerView.adapter = StickersAdapter(listOfAnimatedEmotes())
        binding.recyclerView.layoutManager = GridLayoutManager(this, 3)
    }

    private fun listOfAnimatedEmotes() = mutableListOf<String>().apply {
        resources.assets.list("animated")?.map {
            add("animated/$it")
        }
    }
}
