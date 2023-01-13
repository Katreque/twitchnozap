package com.example.twitchnozap

import android.graphics.ImageDecoder
import android.graphics.drawable.AnimatedImageDrawable
import android.graphics.drawable.Drawable
import androidx.recyclerview.widget.RecyclerView
import com.example.twitchnozap.databinding.ViewHolderStickerBinding

class StickersViewHolder(
    private val binding: ViewHolderStickerBinding
) : RecyclerView.ViewHolder(binding.root) {
    fun bind(resName: String) {
        binding.root.setImageDrawable(createDrawableFromEmote(resName))
    }

    private fun createDrawableFromEmote(resName: String): Drawable {
        val src = ImageDecoder.createSource(binding.root.resources.assets, resName)
        val animDrawable = ImageDecoder.decodeDrawable(src)
        (animDrawable as AnimatedImageDrawable).start()

        return animDrawable
    }
}