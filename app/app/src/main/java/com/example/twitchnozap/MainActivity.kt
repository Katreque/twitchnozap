package com.example.twitchnozap

import android.content.res.Resources
import android.graphics.ImageDecoder
import android.graphics.drawable.AnimatedImageDrawable
import android.graphics.drawable.Drawable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.twitchnozap.databinding.ActivityMainBinding
import com.example.twitchnozap.databinding.ViewHolderStickerBinding

class MainActivity : AppCompatActivity() {
    lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(LayoutInflater.from(this))
        setContentView(binding.root)
        binding.recyclerView.adapter = StickersAdapter(listOf(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1))
        binding.recyclerView.layoutManager = GridLayoutManager(this, 3)
    }
}

class StickersAdapter(
    private val stickerList: List<Any>
) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return StickersViewHolder(ViewHolderStickerBinding.inflate(LayoutInflater.from(parent.context)))
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        (holder as StickersViewHolder).bind()
    }

    override fun getItemCount(): Int = stickerList.size
}

class StickersViewHolder(
    private val binding: ViewHolderStickerBinding
) : RecyclerView.ViewHolder(binding.root) {
    fun bind() {
        binding.root.setImageDrawable(createDrawableFromEmote(binding.root.resources))
    }

    private fun createDrawableFromEmote(res: Resources): Drawable {
        val src = ImageDecoder.createSource(res, R.drawable.gigachad)
        val animDrawable = ImageDecoder.decodeDrawable(src)
        (animDrawable as AnimatedImageDrawable).start()

        return animDrawable
    }
}
